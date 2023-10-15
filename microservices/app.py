from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, abort, marshal, fields
from flask_mysqldb import MySQL
from flask_mail import Mail, Message
import logging
from datetime import datetime
from flask_cors import CORS


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'rahul'

mail = Mail(app)  # instantiate the mail class

# configuration of mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'mailerbot8@gmail.com'
app.config['MAIL_PASSWORD'] = 'gboboszvjbgpisoh'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

mysql = MySQL(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

USER_TABLE = "users"


def notifyUser(msgBody, email):
    msg = Message(
        'Hey',
        sender='mailerbot8@gmail.com',
        recipients=[email]
    )
    msg.body = msgBody
    mail.send(msg)
    return 'Sent'

# Resource: All users transit
class UserList(Resource):
    def __init__(self):
        super(UserList, self).__init__()

    def get(self):
        oSystem = request.headers.get('User-Agent')
        logging.basicConfig(filename='userList.log', encoding='utf-8',
                            level=logging.INFO, format='%(asctime)s %(message)s')
        logging.info('All users transit list fetch request')
        logging.info(oSystem)
        cursor = mysql.connection.cursor()

        # Executing SQL Statements
        dbQuery = "SELECT * FROM users INNER JOIN transits ON users.vNum = transits.vNum"
        cursor.execute(dbQuery)

        allUsersList = [dict((cursor.description[i][0], value)
                    for i, value in enumerate(row)) for row in cursor.fetchall()]

        if (len(allUsersList) == 0):
            logging.info('All users transit list fetch fail')
            abort(404)

        logging.info('All users transit list fetch success')
        return jsonify({"data": allUsersList})

# Resource: Individual User transit
class IndividualUserList(Resource):
    print('in')
    def __init__(self):
        super(IndividualUserList, self).__init__()
    
    def get(self):
        args = request.args
        email = args.get('email')
        logging.basicConfig(filename='individualuserlist.log', encoding='utf-8',
                            level=logging.INFO, format='%(asctime)s %(message)s')
        logging.info('Individual User transit fetch request - ' + email)
        cursor = mysql.connection.cursor()

        # Executing SQL Statements
        vNumQ = "SELECT vNum FROM users WHERE email LIKE '{0}'".format(email)
        cursor.execute(vNumQ)
        vNum = [dict((cursor.description[i][0], value)
                    for i, value in enumerate(row)) for row in cursor.fetchall()]
        logging.info(vNum)
        if (len(vNum) == 0):
            logging.info('Vehcile number fetch fail')
            abort(404)
        vNumNew = vNum[0]['vNum']
        logging.info(vNumNew)
        dbQuery = "SELECT * FROM transits WHERE vNum LIKE '{0}'".format(vNumNew)
        cursor.execute(dbQuery)

        userList = [dict((cursor.description[i][0], value)
                    for i, value in enumerate(row)) for row in cursor.fetchall()]
        logging.info(userList)
        if (len(userList) < 0):
            logging.info('Individual User transit list fetch fail')
            abort(404)

        logging.info('Individual User transit list fetch success')
        return jsonify({"data": userList})

# Resource: Create a new user
class CreateUser(Resource):
    def __init__(self):
        super(CreateUser, self).__init__()

    def post(self):
        try:
            args = request.json
            firstName = args.get('firstName')
            lastName = args.get('lastName')
            email = args.get('email')
            phone = args.get('phone')
            vNum = args.get('vNum')
            password = args.get('password')

            cursor = mysql.connection.cursor()
            logging.basicConfig(filename='createUser.log', encoding='utf-8',
                                level=logging.INFO, format='%(asctime)s %(message)s')
            logging.info('User create request')
            logging.info('New user details:')

            existQuery = "SELECT * from users WHERE phone='{0}' OR email='{1}' OR vNum='{2}';".format(
                phone, email, vNum)
            cursor.execute(existQuery)
            userDetails = [dict((cursor.description[i][0], value)
                                for i, value in enumerate(row)) for row in cursor.fetchall()]
            if (len(userDetails) > 0 or args == None):
                logging.info('Individual User transit list fetch fail')
                abort(404)
            
            # Executing SQL Statements
            values = [firstName, lastName, email, phone, vNum, password]
            tVals = tuple(values)
            attributes = ['firstName', 'lastName',
                          'email', 'phone', 'vNum', 'password']
            tAttrs = tuple(attributes)
            fields = ','.join(tAttrs)
            queryJoin = ','.join(['%s']*len(tVals))
            dbQuery = f"INSERT INTO users ({fields}) VALUES ({queryJoin})"
            logging.info(tVals)
            cursor.execute(dbQuery, tVals)
            mysql.connection.commit()
            logging.info("User created")
            logging.info("Send email request")
            msgBody = "Hey {0}, Welcome to Automated Carpool Parking System. Thanks for registering your vehicle {1}.".format(
                firstName, vNum)
            notifyUser(msgBody, email)
            logging.info("Email sent")
            return jsonify({"data": "Create success"})
        except:
            return jsonify({"error": "Unable to create user"})

# Resource: Create a new user
class AddEntry(Resource):
    def __init__(self):
        super(AddEntry, self).__init__()

    def post(self):
        try:
            args = request.json
            vNum = args.get('vNum')
            vDate = args.get('vDate')
            vTime = args.get('vTime')
            pNum = args.get('pNum')

            cursor = mysql.connection.cursor()
            logging.basicConfig(filename='createEntry.log', encoding='utf-8',
                                level=logging.INFO, format='%(asctime)s %(message)s')
            logging.info('Entry create request')

            existQuery = "SELECT vNum from users WHERE vNum='{0}';".format(vNum)
            cursor.execute(existQuery)
            existDetails = [dict((cursor.description[i][0], value)
                                for i, value in enumerate(row)) for row in cursor.fetchall()]
            
            isDefaulter = 0
            isVerified = 0
            if (len(existDetails) > 0):
                isVerified = 1
            
            if (pNum < 3):
                isDefaulter = 1
            
            # Executing SQL Statements
            values = [vNum, vDate, vTime, pNum, isDefaulter, isVerified]
            tVals = tuple(values)
            attributes = ['vNum', 'vDate', 'vTime', 'pNum', 'isDefaulter', 'isVerified']
            tAttrs = tuple(attributes)
            fields = ','.join(tAttrs)
            queryJoin = ','.join(['%s']*len(tVals))
            dbQuery = f"INSERT INTO transits ({fields}) VALUES ({queryJoin})"
            logging.info(tVals)
            cursor.execute(dbQuery, tVals)
            mysql.connection.commit()
            logging.info("Entry created")
            return jsonify({"data": "Entry success"})
        except:
            return jsonify({"error": "Unable to create entry"})

api = Api(app)

api.add_resource(UserList, "/users")
api.add_resource(IndividualUserList, "/user")
api.add_resource(CreateUser, "/user/create")
api.add_resource(AddEntry, "/entry")

if __name__ == "__main__":
    app.run(debug=True)
