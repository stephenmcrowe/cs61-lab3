'''
Stephen Crowe, Shikhar Sinha
Prof. Pierson
CS61: Databases
27 April 2020

The Client Side of our Lab 3 Application

'''

import sys
import requests
import jwt

baseURL = "http://localhost:3000/employees"
token = None
isAdmin = 0
employeeID = 0
global header

def login(username, password):
    global token
    global isAdmin
    global employeeID
    global header
    res = requests.post("http://localhost:3000/signin", data={ 'username':username, 'password':password})
    if res.status_code != 200:
        if not res.json().get('error'):
            print("Something went wrong {}".format(res.status_code))
            return False
        print(res.json()['error'])
        return False
    else:
        token = res.json()['response']['token']
        isAdmin = res.json()['response']['IsAdmin']
        employeeID = res.json()['response']['EmployeeId']
        header = { "Authorization": "JWT {}".format(token) }
        return True


def create(fields):
    global header
    # make sure this works when the header isnt passed
    res = requests.post(baseURL, data=fields,headers=header)
    # expecting to get a status of 201 on success
    if res.status_code != 200:
        if not res.json().get('error'):
            print("Something went wrong {}".format(res.status_code))
            return 
        print(res.json()['error'])
        return

    print(res.json()['response'])


def read(fields):
    #make get call to url
    global header
    res = requests.get(baseURL, params=fields, headers=header)
	#expecting to get a status of 200 on success
    if res.status_code != 200:
        print("Something went wrong {}".format(res.status_code))
        return
    for employee in res.json()['response']:
        print(employee)
        print()


def read_self():
    global header
    global employeeID
    res = requests.get(baseURL + "/" + str(employeeID), headers=header)
    #expecting to get a status of 200 on success
    if res.status_code != 200:
        print("Something went wrong {}".format(res.status_code))
        return
    print(res.json()['response'][0])
    print()
    

def update(employee_to_change, data):
    #make post call to url passing it data
    global header
    # res = requests.put(baseURL, params={'id':employee_to_change},data=data, headers=header)
    res = requests.put(baseURL+'/'+str(employee_to_change),data=data, headers=header)

    #expecting to get a status of 200 on success
    if res.status_code != 200:
        print('Something went wrong {}'.format(res.status_code))
        return
    print(res.json()['response'])
    print()


def delete(employeeID):
    url = "http://localhost:3000/employees/{}".format(employeeID)
    global header
    res = requests.delete(url, headers=header)
    #expecting to get a status of 200 on success
    if res.status_code != 200:
        print('Something went wrong {}'.format(res.status_code))
        return
    print('delete succeeded')
    # print(res.json())






def collect_user():
    user = input("Please enter a username (at most 45 characters). Enter % to not specify a username: ")
    while len(user) > 45:
        user = input("\nUsername must be less than 45 characters: ")
    if user == '%':
        return None
    return user

def collect_hire_date():
    yr = input("\nDate of hire, enter % to skip specifiying on hire date, else enter a year: ")
    if yr == '%':
        return None
    try:
        if yr == '%':
            return None
        yr = int(yr)
    except ValueError:
        yr = -1

    while yr < 0:
        try:
            yr = int(input("\nYear: must be positive integer: "))
        except ValueError:
            yr = -1

    month = -1
    while month < 1 or month > 12:
        try:
            month = int(input("\nMonth: must be positive, b/w 1 and 12: "))
        except ValueError:
            month = -1
    
    day = -1
    while day < 1 or day > 31:
        try:
            day = int(input("\nDay: must be positive, b/w 1 and 31: "))
        except ValueError:
            day = -1
    res = str(str(yr) + '-' + str(month) + '-' + str(day))
    print(res)
    return res

def collect_salary():
    salary = input("\nEnter a salary. Enter % to skip specifiying a salary: ")
    if salary == '%':
        return None
    try:
        salary = int(salary)
    except ValueError:
        salary = -1
    while salary <= 0:
        try:
            salary = input("\nSalary: must be positive: ")
            if salary == '%':
                return None
            salary = int(salary)
        except ValueError:
            salary = -1
    return str(salary)

def collect_is_admin():
    is_admin = input("\nAdmin status: press y (admin) or n (not). Enter '%' to not specify: ")
    while is_admin != 'y' and  is_admin != 'n' and is_admin != '%':
        is_admin = input("Please enter y, n, or %: ")
    if is_admin == '%':
        return None
    elif is_admin == 'y':
        return 1
    else:
        return 0

def collect_password():
    password = input("\nEnter a password, press % to not specify: ")
    if password == '%':
        return None
    else:
        return password

def collect_read_data():
    data = dict()
    user = input("Please enter a username (at most 45 characters). Enter % to not specify a username. Enter ! to not specify on any fields: ")
    while len(user) > 45:
        user = input("Username must be at most 45 characters")
 
    if user != None:
        if(user == '!'):
            return data
        if(user != '%'):
            data['Username'] = user

    hire_date = collect_hire_date()
    salary = collect_salary()
    is_admin = collect_is_admin()
    if hire_date != None:
        data['HireDate'] = hire_date
    if salary != None:
        data['Salary'] = salary
    if is_admin != None:
        data['IsAdmin'] = is_admin
    return data

def collect_update_data():
    data = dict()
    user = collect_user()
    hire_date = collect_hire_date()
    salary = collect_salary()
    is_admin = collect_is_admin()
    password = collect_password()
    if user != None:
        data['Username'] = user
    if hire_date != None:
        data['HireDate'] = hire_date
    if salary != None:
        data['Salary'] = salary
    if is_admin != None:
        data['IsAdmin'] = is_admin
    if password != None:
        data['Password'] = password
    return data

def collect_change_own_data():
    data = dict()
    user = collect_user()
    hire_date = collect_hire_date()
    salary = collect_salary()
    password = collect_password()
    if user != None:
        data['Username'] = user
    if hire_date != None:
        data['HireDate'] = hire_date
    if salary != None:
        data['Salary'] = salary
    if password != None:
        data['Password'] = password
    return data
    
def collect_create_data():
    data = dict()
    user = None
    while user == None:
        user = input("Please enter a username (can't be empty): ")
    hire_date = collect_hire_date()
    salary = collect_salary()
    is_admin = collect_is_admin()
    password = None
    while password == None:
        password = input("\nPlease enter a password (can't be empty): ")
    data['Username'] = user
    if hire_date != None:
        data['HireDate'] = hire_date
    if salary != None:
        data['Salary'] = salary
    if is_admin != None:
        data['IsAdmin'] = is_admin
    data['Password'] = password
    return data




def handle_admin(usr, pswd):
    response = input("Press y to view options, or n to quit: ")
    while response != 'y' and response != 'n':
        response = input("y for view options, or n to quit: ")
    if response == 'n':
        return
    else:
        print("\nAny changes you make to your own admin status or anyone else's will be applied at the modified user's next login\n")
        running = True
        while running:
            response = input("\npress c to create a record, r to read records, u to update a record, or d to delete a record: ")
            valid_activites = {'c', 'r', 'u', 'd'}
            while response not in valid_activites:
                response = input("\nc for create, r to read, u to update, d to delete: ")


            if response == 'c':
                print("\nPlease enter all the data for the profile you wish to create\n")
                data = collect_create_data()
                create(data)
    
            elif response == 'r':
                read(collect_read_data())

            elif response == 'u':
                employee_to_change = input("\nFirst specify the employeeID you want to update\n")
                print("\nNow, specify the new data you wish to update\n")
                new_data = collect_update_data()
                update(employee_to_change, new_data)

            else: # response == 'd'
                to_delete = input("\nEnter the employeeID of the user you wish to delete: ")
                while to_delete == None:
                    to_delete = input("\nEnter the employeeID of the user you wish to delete: ")
                delete(to_delete)
            
            response = input("\nPress y to perform another operation, or n to quit: ")
            while response != 'y' and response !='n':
                response = input("\ny or n: ")
            if response == 'n':
                running = False

def handle_non_admin(usr, pswd):
    response = input("\nPress y to view options, or n to quit: ")
    while response != 'y' and response != 'n':
        response = input("\ny for more options, or n to quit: ")
    if response == 'n':
        return
    else:
        running = True
        while running:
            response = input("\nPress r to read your data or u to update your data: ")
            valid_activites = {'r', 'u'}
            while response not in valid_activites:
                response = input("\nr to read, u to update: ")

            if response == 'r':
                read_self()

            elif response == 'u':
                print("\nSpecify the new data you wish to update")
                new_data = collect_change_own_data()
                update(employeeID, new_data)

            response = input("\nPress y to perform another operation, or n to quit: ")
            while response != 'y' and response !='n':
                response = input("\ny or n: ")
            if response == 'n':
                running = False




if __name__ == '__main__':

    print("Welcome Health Inspector!")
    username = input("Please enter your Username: ")
    password = input("Password: ")

    # Send login info
    while not(login(username, password)):
        username = input("Please enter your Username: ")
        password = input("Password: ") 

    print("Welcome\n")

    if isAdmin == 1:
        handle_admin(username, password)
    else:
        handle_non_admin(username, password)


