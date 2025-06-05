import asyncio
from bleak import BleakClient, BleakScanner
import csv
from datetime import datetime

HR_UUID = "00002a37-0000-1000-8000-00805f9b34fb"

async def main():
    print("Escaneando dispositivos BLE...")
    devices = await BleakScanner.discover()
    sensor = next((d for d in devices if d.name and "Movesense" in d.name), None)

    if not sensor:
        print("Sensor Movesense no encontrado.")
        return

    print(f"Conectando a {sensor.name} ({sensor.address})...")
    data = []

    def handle_hr(_, value):
        hr_value = int(value[1])
        timestamp = datetime.now().isoformat()
        print(f"HR: {hr_value} bpm")
        data.append([timestamp, hr_value])

    async with BleakClient(sensor.address) as client:
        await client.start_notify(HR_UUID, handle_hr)
        print("Recolectando datos por 10 segundos...")
        await asyncio.sleep(10)
        await client.stop_notify(HR_UUID)

    # Guardar CSV
    filename = f"movesense-pawsitive/src/csv/hr_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.csv"
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "heart_rate"])
        writer.writerows(data)
    print(f"CSV guardado: {filename}")

if __name__ == "__main__":
    asyncio.run(main())
