from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))

@socketio.on('my event')
def handle_my_custom_event(json):
    emit('my response', json)

def ack():
    emit('pong2', 'pong2')
    print('pong callback')

@socketio.on('ping')
def handle_my_custom_event(json):
    print('pinged')
    emit('pong', 'pong', callback=ack)



if __name__ == '__main__':
    socketio.run(app)


