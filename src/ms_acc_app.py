import asyncio
import csv
import os
import json
from datetime import datetime
from bleak import BleakClient, BleakScanner

# UUIDs del servicio y características del Movesense HR2
SERVICE_UUID = "34802252-7185-4d5d-b431-630e7050e8f0"
CONTROL_UUID = "34800001-7185-4d5d-b431-630e7050e8f0"
NOTIFY_UUID = "34800002-7185-4d5d-b431-630e7050e8f0"

#SERVICE_UUID = "00001910-0000-1000-8000-00805f9b34fb"
#CONTROL_UUID = "00002b11-0000-1000-8000-00805f9b34fb"
#NOTIFY_UUID = "00002b10-0000-1000-8000-00805f9b34fb"

# Ruta para guardar el CSV
CSV_DIR = "movesense-pawsitive/src/csv"
os.makedirs(CSV_DIR, exist_ok=True)

data_buffer = []

def handle_notification(sender, data):
    timestamp = datetime.utcnow().isoformat()
    hex_data = data.hex()
    data_buffer.append((timestamp, hex_data))

async def main():
    print("Escaneando dispositivos BLE...")
    devices = await BleakScanner.discover()
    print(devices);
    sensor = next((d for d in devices if "74:92:BA:10:FE:1B" in d.address), None)
    #sensor = next((d for d in devices if "38:1F:8D:C3:2B:EB" in d.address), None)

    if not sensor:
        print("❌ Sensor Movesense no encontrado.")
        return

    print(f"Conectando a {sensor.name} ({sensor.address})...")
    async with BleakClient(sensor.address) as client:
        if not client.is_connected:
            print("❌ Falló la conexión.")
            return

        print("Conectado. Iniciando notificaciones...")

        # Suscripción al acelerómetro (a 13 Hz)
        subscription_msg = {
            "Uri": "/Meas/Acc/13",
            "Verb": "SUBSCRIBE"
        }
        msg_bytes = json.dumps(subscription_msg).encode("utf-8")
        await client.write_gatt_char(CONTROL_UUID, msg_bytes)

        await client.start_notify(NOTIFY_UUID, handle_notification)

        print("Recolectando datos durante 10 segundos...")
        await asyncio.sleep(10)

        print("Deteniendo notificaciones...")
        await client.stop_notify(NOTIFY_UUID)

        # Guardar CSV
        timestamp_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"{CSV_DIR}/{timestamp_str}.csv"
        print(f"Guardando datos en '{filename}'...")

        with open(filename, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["timestamp", "raw_data_hex"])
            writer.writerows(data_buffer)

        print("✅ CSV guardado correctamente.")

if __name__ == "__main__":
    asyncio.run(main())

