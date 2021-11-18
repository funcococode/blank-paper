const latestGrid = document.getElementById('latestGrid');
const template = document.getElementById('skeleton-card-template');
const catTabs = document.querySelectorAll(".homeCategoryTabs");
const profileImg = document.querySelector('#profileImg');
const upa = document.querySelector('#userProfileArea');
const landingPage = document.querySelector('.mainLanding')
const upaFieldWrapper = document.querySelectorAll('.upaFieldWrapper');
const usc = document.querySelectorAll('.upa-save-change');
const searchBar = document.querySelector('#searchBar');
const allFriendsContainer = document.querySelector('#allFriendsContainer');

for (let i = 0; i < 6; i++) {
    latestGrid.appendChild(template.content.cloneNode(true))
}


let sessusername;

let fetchUserDetails = async () => {
    let details = await fetch('/home/details')
        .then(res => res.json())
        .then(data => {
            sessusername = data[0].username;
            getFriends(sessusername);
            return data[0];
        });

    return details;
}


let latestNews = async (category, country, query) => {
    category = category || "general";
    country = country || "in";
    query = query || null;

    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=ce21eb73eade41debc169280219656a3`;

    let data = await fetch(url)
        .then(res => res.json())
        .then(newsArr => newsArr.articles);

    let mappedData = data.map(news => {
        return `
            <div class="newsCard">
                <div class="newsImg">
                    ${news.urlToImage ? "<img src="+news.urlToImage+">" : ""}
                </div>
                <h2 class="headline">
                    ${news.title}
                </h2>
                <p class="desc">
                    ${news.description ? news.description : ""}
                </p>
            </div>  
        `
    }).join("");

    latestGrid.innerHTML = mappedData;

    fetchUserDetails()
}

latestNews("general")


catTabs.forEach(tab => tab.addEventListener('click', function (e) {
    this.classList.add('is-active');
    catTabs.forEach(elem => {
        if (elem != this && elem.classList.contains("is-active")) {
            elem.classList.remove('is-active');
            return;
        }
    })
}));














profileImg.addEventListener('click', function (e) {
    fetchUserDetails().then(data => {
        // window.location.href = `/user/${data.username}`
        upa.classList.toggle('open');
        landingPage.classList.toggle('close');
        document.body.classList.toggle('stopScroll')
        upa.querySelector('#upa-fullname').value = `${data.firstname} ${data.lastname}`;
        upa.querySelector('#upa-username').value = `${data.username}`;
        upa.querySelector('#upa-email').value = `${data.email}`;
        upa.querySelector('#upa-password').value = `${data.password}`;
    })
})




upaFieldWrapper.forEach(ufw => ufw.addEventListener('dblclick', function (e) {
    this.classList.toggle('closed');
    if (this.classList.contains('closed')) {
        ufw.querySelector('input').setAttribute('readonly', '');
    } else {
        ufw.querySelector('input').removeAttribute('readonly');
    }
}))

usc.forEach(button => button.addEventListener('click', function (e) {
    let changedValue = this.nextElementSibling.value;
    let field = this.getAttribute('data-field');

    fetchUserDetails().then(data => {
        let body = {
            username: data.username,
            field,
            value: changedValue
        }
        fetch(`/user/${data.username}/update`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(body)
            }).then(response => response.json())
            .then(data => {
                this.parentNode.classList.toggle('closed')
            });
    })
}))


searchBar.addEventListener('focusout', (e) => {
    let {
        value
    } = e.target;
    if (value != "" && value.length >= 3) {
        fetch(`/user/search/`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    value
                })
            })
            .then(res => res.json())
            .then(data => {
                let userlist = data.filter(user => user.username != sessusername).map(user => {
                //     let button, acceptButton = null;
                //     if (user.status == 0 && user.from_username == sessusername) { //sent a request
                //         button = `<button class="level-item button is-danger is-small is-light" title="Cancel Request" onclick='removeFriend("${sessusername}","${user.username}")'>
                //         <span class="icon is-small">
                //             <i class="fas fa-user-minus"></i>
                //         </span>
                //         </button>`;
                //     } else if (user.status == 0 && user.to_username == sessusername) { //recieved a request
                //         button = `<button class="level-item button is-danger is-light is-small" title="Delete Request" onclick='removeFriend("${user.username}","${sessusername}")'>
                //             <span class="icon is-small">
                //                 <i class="fas fa-times"></i>
                //             </span>
                //         </button>`;
                //         acceptButton = `<button title="Accept Request" onclick='acceptFriend("${user.username}","${sessusername}")'>
                //         <span class="icon is-small">
                //             <i class="fas fa-check"></i>
                //         </span>
                //         </button>`;
                //     } else if (user.status == 1) { //already friends
                //         button = `<div title="You both are friends" class="button is-primary is-light is-small">
                //             <span class="icon is-small">
                //                 <i class="fas fa-check"></i>
                //             </span>
                //         </div>`;
                //     } else {
                //         button = `<button class="level-item button is-link is-small  is-light " title="Send Request" onclick='addFriend("${sessusername}","${user.username}")'>
                //         <span class="icon is-small">
                //             <i class="fas fa-user-plus"></i>
                //         </span>
                //         </button>`;
                //     }


                //     // return `
                //     // <li class="searchUserResult">
                //     //     <div>
                //     //         <img src="https://source.unsplash.com/200x200/?face" id="homeImg" >
                //     //     </div>
                //     //     <p>
                //     //         <span class="sur-fullname">${user.firstname} ${user.lastname}</span>
                //     //         <span class="sur-username">@${user.username}</span>
                //     //         ${button}
                //     //         ${!acceptButton ? "" : acceptButton}
                //     //     </p>
                //     // </li>`

                    return `
                    <div class="box ">
                        <article class="media">
                            <div class="media-left">
                            <figure class="image is-32x32">
                                <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
                            </figure>
                            </div>
                            <div class="media-content">
                            <div class="content">
                                <strong>${user.firstname} ${user.lastname}</strong> <small>@${user.username}</small>
                            </div>
                            
                            </div>
                        </article>
                    </div>
                    `
                }).join('');

                document.getElementById('searchResult').style.visibility = 'visible';
                document.getElementById('searchResult').innerHTML = userlist;
            });
    } else {
        document.getElementById('searchResult').style.visibility = 'hidden';
        document.getElementById('searchResult').innerHTML = '';
    }
});

function getFriends(friends_of) {
    let body = {
        username: friends_of
    }
    fetch(`/user/getFriends/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            let friendList = JSON.parse(data).map(name => `<li class="friend">${name.firstname} ${name.lastname}</li>`);

            allFriendsContainer.innerHTML = friendList.join('');
        });
}

function addFriend(from, to) {
    let body = {
        from,
        to
    }
    fetch(`/user/addFriend/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function removeFriend(from, to) {
    let body = {
        from,
        to
    }
    fetch(`/user/removeFriend/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function acceptFriend(from, to) {
    let body = {
        from,
        to
    }
    fetch(`/user/acceptFriend/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

// ce21eb73eade41debc169280219656a3 newsapi key