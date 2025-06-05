from bleak import BleakScanner, BleakClient
import asyncio

async def identify_movesense():
    devices = await BleakScanner.discover()
    for d in devices:
        print(f"{d.name} [{d.address}]")

    # Conéctate al que crees que es el Movesense (cambia si es necesario)
    address = "38:1F:8D:C3:2B:EB"
    async with BleakClient(address) as client:
        print(f"Conectado a {address}")
        svcs = await client.get_services()
        for service in svcs:
            print(f"Service: {service.uuid}")
            for char in service.characteristics:
                print(f" └─ Char: {char.uuid} - {char.properties}")

asyncio.run(identify_movesense())

