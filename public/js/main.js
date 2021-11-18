const formTipBtn = document.querySelectorAll('.formTipBtn');
const loginForm = document.querySelector('#loginForm');
const signupForm = document.getElementById('signupForm');
const suserField = document.getElementById('susername');
const suBtn = document.getElementById('signupBtn');
const loBtn = document.getElementById('loginBtn');
const luserField = document.getElementById('lusername');
const successMsg = document.getElementById('successMsg');

formTipBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        document.body.classList.toggle('login');
    })
})


loBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let formdata = new FormData(loginForm);
    let body = {
        username: formdata.get('lusername'),
        password: formdata.get('lpass')
    };

    fetch('/login', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(message => {
            if (message == "YES") {
                window.location.href = '/home'
            } else {
                document.getElementById('loginErrorsSection').innerHTML = `<li>${message}</li>`;
            }

        });
})

suBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let formdata = new FormData(signupForm);
    let body = {
        firstname: formdata.get('firstname'),
        lastname: formdata.get('lastname'),
        email: formdata.get('semail'),
        username: formdata.get('susername'),
        password: formdata.get('spass'),
    };
    let valueAuth = validateFields(body); //Validate signup fields first then proceed
    if (valueAuth.status) {
        fetch('/register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            .then(res => res.json())
            .then(message => {
                if (message == "NO") {
                    alert('An error occured while creating your account. Please try again.')
                } else {
                    document.getElementById('signupErrorsSection').innerHTML = '';
                    document.querySelectorAll('input').forEach(field => {
                        field.setAttribute("disabled", "")
                    })
                    setTimeout(() => {
                        suBtn.innerText = "Creating your account..."
                    }, 500)
                    setTimeout(() => {
                        suBtn.innerText = "Setting up your profile..."
                    }, 2500)
                    setTimeout(() => {
                        suBtn.innerText = "Almost There..."
                    }, 4000)
                    setTimeout(() => {
                        successMsg.classList.add('visible')
                        suBtn.style.background = '#00fb9b'
                        suBtn.style.color = 'black'
                        suBtn.innerText = "Done! Your account has been created."
                        suBtn.style.pointerEvents = "none";
                    }, 5000)
                }
            })
    } else {
        let errText = valueAuth.errors.map(err => `<li>${err}</li>`).join('');
        document.getElementById('signupErrorsSection').innerHTML = errText;
    }

})

suserField.addEventListener('focusout', (e) => {
    let value = e.target.value;
    if (value != '') {

        fetch('/checkuser', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: value
                })
            })
            .then(res => res.json())
            .then(message => {
                if (message == "NO") {
                    suserField.style.borderColor = "red";
                    suserField.style.color = "red";
                    document.querySelector('#susername + label').style.color = "red";
                    document.querySelector('#susername ~ .fieldTip').innerHTML = "Username not available";
                    document.querySelector('#susername ~ .fieldTip').style.color = "red";
                    document.querySelector('#susername ~ .fieldTip').style.opacity = "1";
                } else {
                    suserField.style.borderColor = "#00fb9b";
                    suserField.style.color = "#00fb9b";
                    document.querySelector('#susername + label').style.color = "#00fb9b";
                    document.querySelector('#susername ~ .fieldTip').innerHTML = "Username available";
                    document.querySelector('#susername ~ .fieldTip').style.color = "#00fb9b";
                    document.querySelector('#susername ~ .fieldTip').style.opacity = "1";
                }
            });
    }
})




function validateFields(obj) {
    let returnObj = {
        errors: [],
        status: true
    }

    let {
        firstname,
        lastname,
        email,
        password,
        username
    } = obj;

    if (firstname == '' || lastname == '' || email == '' || username == '' || password == '') {
        returnObj.errors.push("Empty fields are not allowed");
        returnObj.status = false;
    }

    if (!validateEmail(email)) {
        returnObj.errors.push("Please enter a valid email address");
        returnObj.status = false;
    }

    if (!checkPassword(password)) {
        returnObj.errors.push("Password not valid.");
        returnObj.status = false;
    }

    return returnObj;

}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@_#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
}