import asyncio
from bleak import BleakClient, BleakScanner
import json
import struct

CONTROL_UUID = "34800001-7185-4d5d-b431-630e7050e8f0"
NOTIFY_UUID  = "34800002-7185-4d5d-b431-630e7050e8f0"

def encode_mds_message(method, uri):
    message = {
        "method": method,
        "uri": uri
    }
    json_str = json.dumps(message)
    header = struct.pack("<I", len(json_str))  # 4-byte little-endian length
    return header + json_str.encode("utf-8")

def handle_notification(_, data):
    try:
        length = struct.unpack("<I", data[:4])[0]
        json_msg = data[4:4+length].decode("utf-8")
        print("📥 URI Response:", json.dumps(json.loads(json_msg), indent=2))
    except Exception as e:
        print("Error decoding:", e)

async def main():
    devices = await BleakScanner.discover()
    sensor = next((d for d in devices if "74:92:BA:10:FE:1B" in d.address), None)
    if not sensor:
        print("No BLE sensor found.")
        return

    async with BleakClient(sensor.address) as client:
        print(f"✅ Conectado a {sensor.name} ({sensor.address})")
        await client.start_notify(NOTIFY_UUID, handle_notification)
        
        # Enviar GET /
        message = encode_mds_message("GET", "/")
        await client.write_gatt_char(CONTROL_UUID, message)
        
        await asyncio.sleep(3)  # Espera la respuesta
        await client.stop_notify(NOTIFY_UUID)

asyncio.run(main())
