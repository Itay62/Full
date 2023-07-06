from flask import Flask, request, abort, make_response, jsonify
from settings import dbpwd, s3_access_key, s3_secret_access_key
import mysql.connector as mysql
import mysql.connector.pooling
import json
import uuid
import bcrypt
import boto3
import datetime


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        return super().default(obj)


pool = mysql.connector.pooling.MySQLConnectionPool(
    host="127.0.0.1",
    user="root",
    passwd=dbpwd,
    database="website",
    buffered=True,
    pool_size=5,
    pool_name="mypool"
)

# pool = mysql.connector.pooling.MySQLConnectionPool(
#     host="itays-db.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
#     user="admin",
#     passwd=dbpwd,
#     database="website",
#     buffered=True,
#     pool_size=5,
#     pool_name="mypool"
# )

# db = mysql.connect(
#     host="itays-db.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
#     user="admin",
#     passwd=dbpwd,
#     database="website")


# db = mysql.connect(
#     host="127.0.0.1",
#     user="root",
#     passwd=dbpwd,
#     database="website")


app = Flask(__name__,
            static_folder='C:/Users/itay6/HaToaar/YearIII/SemesterII/FullStack/Ex03/my-app/website_react/build',
            static_url_path='/')

# 'C:/Users/itay6/HaToaar/YearIII/SemesterII/FullStack/Ex03/my-app/website_react/build'


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/aboutme', methods=['GET'])
def about_me():
    db = pool.get_connection()
    query = "SELECT content FROM blog_info LIMIT 1"
    cursor = db.cursor()
    cursor.execute(query)
    record = cursor.fetchone()
    print(record)
    cursor.close()
    db.close()
    if not record:
        print("Nothingn in blog_info table")
        abort(401)
    about_me = record
    return json.dumps(about_me)


@app.route('/logout', methods=['GET'])
def logout():
    session_id = request.cookies.get("session_id")
    if not session_id:
        print("No one is logged in")
        abort(401)
    db = pool.get_connection()
    query = "delete from sessions where session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    resp = make_response()
    resp.delete_cookie("session_id")
    return resp


@app.route('/post/<int:id>', methods=['GET'])
def get_post(id):
    db = pool.get_connection()
    print(id)
    query = "select id, title, body, created_at, img, author from posts where id = %s"
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    print(record)
    cursor.close()
    db.close()
    header = ['id', 'title', 'body', 'created_at', 'img', 'author']
    return json.dumps(dict(zip(header, record)), cls=DateTimeEncoder)


@app.route('/post-editing/<int:id>', methods=['PUT', 'DELETE'])
def manage_edit(id):
    if request.method == 'PUT':
        return edit_post(id)
    else:
        return delete_post(id)


def edit_post(id):
    data = request.get_json()
    db = pool.get_connection()
    query = "UPDATE posts SET title = %s, body = %s WHERE id = %s"
    values = (data['title'], data['body'], id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    post_id = cursor.lastrowid
    cursor.close()
    db.close()
    return str(post_id)


def delete_post(id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "DELETE FROM posts WHERE id = %s"
    values = (id, )
    cursor.execute(query, values)
    print("Deleted post")
    db.commit()
    cursor.close()
    db.close()
    resp = make_response()
    return resp


@app.route('/post/<int:id>/comments', methods=['GET', 'POST'])
def manage_comments_requests(id):
    if request.method == 'GET':
        return get_post_comments(id)
    else:
        return add_comment(id)


def get_post_comments(id):
    db = pool.get_connection()
    query = "SELECT id, text, author FROM comments WHERE post_id = %s"
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    comments = cursor.fetchall()
    cursor.close()
    db.close()
    comments_data = []
    for comment in comments:
        comment_data = {
            'id': comment[0],
            'text': comment[1],
            'author': comment[2]
        }
        comments_data.append(comment_data)
    return jsonify(comments_data)


def add_comment(id):
    print(id)
    data = request.get_json()
    comment_text = data['text']
    comment_author = data['author']
    db = pool.get_connection()
    query = "INSERT INTO comments (text, author, post_id) VALUES (%s, %s, %s)"
    values = (comment_text, comment_author, id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    comment_id = cursor.lastrowid
    cursor.close()
    db.close()

    comment_data = {
        'id': comment_id,
        'text': comment_text,
        'author': comment_author
    }

    return jsonify(comment_data)


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()


def get_all_posts():
    db = pool.get_connection()
    query = "select id, title, body, user_id, created_at, img, author from posts"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    db.close()
    print(records)
    header = ['id', 'title', 'body', 'user_id', 'created_at', 'img', 'author']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    return json.dumps(data, cls=DateTimeEncoder)

# adds a new post to db and returns it with get_post()


def add_post():
    user_id = check_login()
    data = request.get_json()
    print(data)
    db = pool.get_connection()
    query = "insert into posts (title, body ,user_id, author) values (%s, %s, %s, %s)"
    values = (data['title'], data['body'], user_id, data['author'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_post_id = cursor.lastrowid
    cursor.close()
    db.close()
    return get_post(new_post_id)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(data)
    db = pool.get_connection()
    query = "select username from users where username = %s"
    values = (data['sign_user'], )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print(record)

    if record:  # user already exists
        abort(401)

    user_pwd = data['sign_pass']
    hashed_pwd = bcrypt.hashpw(user_pwd.encode('utf-8'), bcrypt.gensalt())
    query = "insert into users (username, password) values(%s, %s)"
    values = (data['sign_user'], hashed_pwd)  # database has hash pwd
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    resp = make_response()
    return resp


@app.route('/login', methods=['POST', 'GET'])
def manage_login_posts():
    if request.method == 'GET':
        return check_login()
    else:
        return login()


def login():
    data = request.get_json()
    print(data)
    db = pool.get_connection()
    query = "select id, username, password from users where username=%s"
    values = (data['user'], )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print(record)
    if not record:
        print("no instance of this user")
        abort(401)

    user_id = record[0]
    hashed_pwd = record[2]
    pwd = data['pass']

    pass_encode = pwd.encode('utf-8')

    if not (bcrypt.checkpw(pass_encode, hashed_pwd.encode('utf-8'))):
        print("password not correct")
        abort(401)

    # check re-login with same user
    query = "select session_id from sessions where user_id=%s"
    values = (user_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()

    if record:
        print("already logged in")
        abort(401)

    query = "insert into sessions (user_id, session_id) values (%s, %s)"
    session_id = str(uuid.uuid4())
    values = (user_id, session_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    resp = make_response()  # http response from server
    resp.set_cookie("session_id", session_id)
    return resp


def check_login():
    session_id = request.cookies.get("session_id")
    if not session_id:
        print("No one is logged in")
        abort(401)
    db = pool.get_connection()
    query = "select user_id from sessions where session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    db.close()
    if not record:
        abort(401)
    return str(record[0])


if __name__ == "__main__":
    app.run()
