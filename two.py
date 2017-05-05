from flask import Flask, redirect, url_for, request, render_template
import os

app = Flask(__name__)
@app.route('/',methods=['POST','GET'])
def index():
	fo = open("kickstart.cfg", "ab+")
	if request.method == 'POST':
		kpass = request.form['pass']
		krpass = request.form['rpass']
		if kpass==krpass:
			pass_command = '#Root passwprd\nrootpw {0}\n'.format(kpass)
			fo.write(pass_command)
	return render_template('index.html')
	fo.close()

if __name__ == '__main__':
   app.run(debug = True)

