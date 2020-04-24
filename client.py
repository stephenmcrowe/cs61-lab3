
import sys
import requests


baseURL = "localhost:3000/employees"

def login(username, password):
    return True

def create(url, fields):
    res = requests.put(url, fields)
#expecting to get a status of 200 on success
    if res.json()['status'] != 200:
        print("Something went wrong {}".format(res.status_code))
        exit()

    print("put succeeded")
    print(res.json())


def read(url, fields):
    #make get call to url
	res = requests.get(url, params=fields)
	#expecting to get a status of 200 on success
	if res.json()['status'] != 200:
		print("Something went wrong {}".format(res.status_code))
		exit()
	print("get succeeded")
	# for inspector in res.json()['response']:
		# print inspector["Us"],restaurant["RestaurantName"],restaurant["Boro"]

def update(url, data):
    #make post call to url passing it data
	res = requests.post(url, json=data)
	#expecting to get a status of 201 on success
	if res.json()['status'] != 201:
		print('Something went wrong {}'.format(res.status_code))
		exit()
	print('post succeeded')
	print(res.json())


def delete(url):
    res = requests.delete(url)
    #expecting to get a status of 200 on success
    if res.json()['status'] != 200:
        print('Something went wrong {}'.format(res.status_code))
        exit()
    print('post succeeded')
    print(res.json())




'''
Fields of Interest that someone can select on:
Username
HireDate
Salary
IsAdmin
'''

def collect_user():
    user = input("please enter a username (at most 45 characters). Enter % to allow any username: ")
    while len(user) > 45:
        user = input("username must be less than 45 characters: ")
    if user == '%':
        return None
    return user

def collect_hire_date():
    yr = input("Time to enter a year of hire, enter % to skip specifiying on hire date, else enter a year: ")
    if yr == '%':
        return None
    try:
        if yr == '%':
            return None
        int(yr)
    except ValueError:
        yr = -1

    while yr < 0:
        try:
            yr = int(input("year: must be positive integer: "))
        except ValueError:
            yr = -1

    month = -1
    while month < 1 or month > 12:
        try:
            month = int(input("year: must be positive, b/w 1 and 12: "))
        except ValueError:
            month = -1
    
    day = -1
    while day < 1 or day > 31:
        try:
            day = int(input("year: must be positive, b/w 1 and 31: "))
        except ValueError:
            day = -1
    return str(yr + '-' + month + '-' + day)

def collect_salary():
    salary = input("Time to enter a salary, enter % to skip specifiying on hire date, else enter a salary: ")
    if salary == '%':
        return None
    try:
        int(salary)
    except ValueError:
        salary = -1
    while salary < 0:
        try:
            salary = input("salary: must be positive: ")
            if salary == '%':
                return None
            salary = int(salary)
        except ValueError:
            salary = -1
    return str(salary)

def collect_is_admin():
    is_admin = input("If you which to specify on admin status, press y or n, else press '%': ")
    while is_admin != 'y' and  is_admin != 'n' and is_admin != '%':
        is_admin = input("please enter y, n, or %: ")
    if is_admin == '%':
        return None
    return is_admin

def collect_password():
    password = input("please enter a password, press % to not specify: ")
    if password == '%':
        return None
    



def handle_admin(usr, pswd):
    response = input("Press y to enter options, or n to quit: ")
    while response != 'y' and response != 'n':
        response = input("y for more options, or n to quit: ")
    if response == 'n':
        return
    else:
        running = True
        while running:
            response = input("press c to create a record, r to read records, u to update a record, or d to delete a record: ")
            valid_activites = {'c', 'r', 'u', 'd'}
            while response not in valid_activites:
                response = input("c for create, r to read, u to update, d to delete: ")
            print("please enter some info for specify your request")

            

            if response == 'c':
                data = dict()
                user = input("enter a username: ")
                while user == '%' or len(user) > 45:
                    user = input("username is required")
                hire_date = collect_hire_date()
                salary = collect_salary()
                is_admin = collect_is_admin()
                password = collect_password()
                data['Username'] = user
                if password == None:
                    data['Password'] = password
                if hire_date != None:
                    data['HireDate'] = hire_date
                if salary != None:
                    data['Salary'] = salary
                if is_admin != None:
                    data['isAdmin'] =  is_admin
                
                #reate(baseURL, data)
            #     # do smth
            elif response == 'r':
                user = collect_user()
                hire_date = collect_hire_date()
                salary = collect_salary()
                is_admin = collect_is_admin()
                data = dict()
                if user != None:
                    data['Username'] = user
                if hire_date != None:
                    data['HireDate'] = hire_date
                if salary != None:
                    data['Salary'] = salary
                if is_admin != None:
                    data['isAdmin'] = is_admin
                if password == None:
                    data['Password'] = password
                #read(baseURL, data)
            #     # do smth
            elif response == 'u':
                print("first specify the health inspectors you want to update")
                user = collect_user()
                hire_date = collect_hire_date()
                salary = collect_salary()
                is_admin = collect_is_admin()
                data = dict()
                if user != None:
                    data['old_Username'] = user
                if hire_date != None:
                    data['old_HireDate'] = hire_date
                if salary != None:
                    data['old_Salary'] = salary
                if is_admin != None:
                    data['old_isAdmin'] = is_admin
                if password == None:
                    data['Password'] = password
                print("now, specify the new data you wish to update")
                user = collect_user()
                hire_date = collect_hire_date()
                salary = collect_salary()
                is_admin = collect_is_admin()
                if user != None:
                    data['new_Username'] = user
                if hire_date != None:
                    data['new_HireDate'] = hire_date
                if salary != None:
                    data['new_Salary'] = salary
                if is_admin != None:
                    data['new_isAdmin'] = is_admin
                if password == None:
                    data['new_Password'] = password
                #update(baseURL, data)

            #     # do smth
            else: # response == 'd'
                user = collect_user()
                hire_date = collect_hire_date()
                salary = collect_salary()
                is_admin = collect_is_admin()
                data = dict()
                if user != None:
                    data['Username'] = user
                if hire_date != None:
                    data['HireDate'] = hire_date
                if salary != None:
                    data['Salary'] = salary
                if is_admin != None:
                    data['isAdmin'] = is_admin

if __name__ == '__main__':
    handle_admin("bs", "lol")

    print("Welcome Health Inspector!")
    username = input("Please enter your Username: ")
    password = input("Password: ")

    # Send login info
    while not(login(username, password)):
        print("Invalid Password/Username combination")
        username = input("Please enter your Username: ")
        password = input("Password: ")  


    


