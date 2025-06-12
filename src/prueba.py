import asyncio
from bleak import BleakClient, BleakScanner
import nest_asyncio
import struct
import csv
from datetime import datetime
from json import dumps

nest_asyncio.apply()

SERVICE_UUID = "34802252-7185-4d5d-b431-630e7050e8f0"
COMMAND_UUID = "00001524-1212-efde-1523-785feabcd123"
NOTIFY_UUID  = "00001525-1212-efde-1523-785feabcd123"

# Lista para guardar las filas antes de escribir
imu_data_rows = []

def parse_imu_data(data: bytearray):
    if data[0] != 0x01:  # solo mensajes tipo "data"
        return
    payload = data[2:]  # omitir msg_type y client_ref
    timestamp = int.from_bytes(payload[0:4], byteorder="little")
    samples = payload[4:]

    for i in range(0, len(samples), 12):
        if i + 12 <= len(samples):
            acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z = struct.unpack_from("<hhhhhh", samples, i)
            imu_data_rows.append([
                timestamp,
                acc_x, acc_y, acc_z,
                gyro_x, gyro_y, gyro_z
            ])

async def main():
    print("Buscando sensor Movesense...")
    device = await BleakScanner.find_device_by_filter(lambda d, _: "74:92:BA:10:FE:1B" in d.address)
    if device is None:
        raise Exception("Sensor Movesense no encontrado.")

    async with BleakClient(device) as client:
        print("Conectado. Enviando comando de suscripción...")

        await client.start_notify(NOTIFY_UUID, lambda _, d: parse_imu_data(bytearray(d)))

        command = {
            "Uri": "/Meas/IMU6/13",
            "ClientReference": 1
        }
        await client.write_gatt_char(COMMAND_UUID, bytes(dumps(command), "utf-8"))

        print("Recopilando datos durante 10 segundos...")
        await asyncio.sleep(10)

        await client.write_gatt_char(COMMAND_UUID, bytes(dumps({"Unsubscribe": 1}), "utf-8"))
        await client.stop_notify(NOTIFY_UUID)
        print("Desuscrito. Guardando archivo CSV...")

        # Escribir datos en CSV
        filename = f"imu_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        with open(filename, mode='w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["timestamp", "acc_x", "acc_y", "acc_z", "gyro_x", "gyro_y", "gyro_z"])
            writer.writerows(imu_data_rows)

        print(f"Datos guardados en: {filename}")

asyncio.run(main())
