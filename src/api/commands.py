"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
import click
from api.models import db, Usuarios


def setup_commands(app):
    """ 
    This is an example command "insert-test-usuarios" that you can run from the command line
    by typing: $ flask insert-test-usuarios 5
    Note: 5 is the number of usuarios to add
    """
    @app.cli.command("insert-test-usuarios")  # Name of our command
    @click.argument("count")  # Argument of out command
    def insert_test_usuarios(count):
        print("Creating test usuarios")
        for x in range(1, int(count) + 1):
            usuario = Usuarios()
            usuario.email = "test_usuario" + str(x) + "@test.com"
            usuario.password = "123456"
            usuario.is_active = True
            db.session.add(usuario)
            db.session.commit()
            print("usuario: ", usuario.email, " created.")
        print("All test usuarios created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
