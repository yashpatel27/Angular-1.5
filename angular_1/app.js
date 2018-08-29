var app = angular.module('myapp',['ngRoute']);

var jsinfo=[
    {
        "recipient":"qq",
        "recipient_img":"null",
        "sender":"tt",
        "sender_img":"null",
        "title":"this is a message",
        "description":"Hellooo",
        "created_at":"2017",
        "important":"0"
    },
    {
        "recipient":"tt",
        "recipient_img":"null",
        "sender":"hi1",
        "sender_img":"null",
        "title":"this is a message222",
        "description":"Hello from NYC",
        "created_at":"2020",
        "important":"0"
    },
    {
        "recipient":"yash",
        "recipient_img":"null",
        "sender":"hi2",
        "sender_img":"null",
        "title":"this is a message333",
        "description":"Hello from CA",
        "created_at":"2018",
        "important":"0"
    }
]
localStorage.setItem('messages',JSON.stringify(jsinfo));
app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'html/login.html',
        controller:'loginCtrl',
    })
    .when('/home',{
        templateUrl:'html/home.html',
        controller:'homeCtrl'
    })
    .when('/profile',{
        templateUrl:'html/profile.html',
        controller:'proCtrl'
     })
    .when('/message',{
        templateUrl:'html/message.html',
        controller:'messCtrl'
     })
     .when('/messagedetial',{
        templateUrl:'html/messagedetial.html',
        controller:'mdetialCtrl'
     })
     .when('/signup',{
        templateUrl:'html/signup.html',
        controller:'signupCtrl'
     });
});

app.controller('loginCtrl',function($scope){
    $scope.clickOk=function(){
        var userlist=JSON.parse(localStorage.getItem('users')||"[]");
        if(userlist.find(a=>a.username===$scope.username)===undefined || userlist.find(b=>b.username===$scope.username).password!=$scope.password)
            $scope.messageArea="username or password is invaild";
        else{
            localStorage.setItem( 'curUser',JSON.stringify(userlist.find(a=>a.username===$scope.username)));
            
            window.location.href="app.html#/home";
        }
    }
});
app.controller('messCtrl',function($scope){
    LoginCheck();
    $scope.clearFcCur=clearFcCur;
    messagelist=JSON.parse(localStorage.getItem('messages')||"[]");
    var curUser=JSON.parse(localStorage.getItem('curUser'));
    $scope.messages=messagelist.filter(a=>a.recipient===curUser.username);

    $scope.jumpFn=function(createAt){
        console.log(createAt);
        localStorage.setItem('curMsg',JSON.stringify(messagelist.find(m=>m.created_at===createAt)));
        window.location.href="app.html#/messagedetial";
    }
    //console.log(curUser.name);


});
app.controller('mdetialCtrl',function($scope){
    LoginCheck();
    $scope.imval='important X'
    curMsg=JSON.parse(localStorage.getItem('curMsg'));
    $scope.replyMsg=false;
    $scope.from=curMsg.sender;
    $scope.to=curMsg.recipient;
    $scope.title=curMsg.title;
    $scope.created_at=curMsg.created_at;
    $scope.description=curMsg.description;
    $scope.value='reply';
    $scope.delete=function(){
        var messagelist=JSON.parse(localStorage.getItem('messages')||"[]");
        messagelist.splice(messagelist.findIndex(m=>m.created_at===curMsg.created_at),1);
        localStorage.setItem('messages',JSON.stringify(messagelist));
        window.location.href="app.html#/message";
    }
    $scope.reply=function(){
        if($scope.value==='reply'){
            $scope.value='cancel';
            $scope.show=true;
        }else{
            console.log($scope);
            $scope.value='reply';
            $scope.show=false;
        }
    }
    $scope.rsubmit=function(){
        console.log($scope.$$childHead);
        var newmessage={}
        newmessage['recipient']=curMsg.sender;
        newmessage['sender']=curMsg.recipient;
        var dt = new Date();
        var utcDate = dt.toUTCString();
        newmessage['created_at']=utcDate;
        newmessage['recipient_img']=curMsg.sender_img;
        newmessage['sender_img']=curMsg.recipient_img;
        newmessage['important']=0;
        newmessage['title']=$scope.$$childHead.title1;
        newmessage['description']=$scope.$$childHead.description1;
        //localStorage.setItem('curUser',JSON.stringify(curUser));
        var messages=JSON.parse(localStorage.getItem('messages')||"[]");
        messages.push(newmessage);
        localStorage.setItem('messages',JSON.stringify(messages));;
        $scope.from1=newmessage.sender;
        $scope.to1=newmessage.recipient;
        $scope.title1=newmessage.title;
        $scope.created_at1=newmessage.created_at;
        $scope.description1=newmessage.description;
        console.log($scope);
        $scope.replyMsg=true;
        $scope.value='reply';
        $scope.show=false;
    }
    $scope.imFn=function(){
        if($scope.imval==='important N'){
            $scope.imval='important Y';
        }else{
            console.log($scope);
            $scope.imval='important N';
        }
    }
});

app.controller('proCtrl',function($scope){
    LoginCheck();
    $scope.value='edit';
    $scope.show=false;
    var curUser=JSON.parse(localStorage.getItem('curUser'));
    $scope.username=curUser.username;
    $scope.password=curUser.password;
    $scope.firstname=curUser.firstname;
    $scope.lastname=curUser.lastname;
    $scope.email=curUser.email;
    $scope.phone=curUser.phone;
    $scope.location=curUser.location;
    $scope.clearFcCur=clearFcCur;

    $scope.editfn=function(){
        if($scope.value==='edit'){
            $scope.editarea='<h1>edit<h1>';
            $scope.value='cancel';
            $scope.show=true;
        }else{
            console.log($scope);
            $scope.editarea='';
            $scope.value='edit';
            $scope.show=false;
        }
    }
    $scope.subedit=function(){
        var curName=curUser.username;
        console.log($scope.$$childHead);
        curUser.username=$scope.$$childHead.username;
        curUser.password=$scope.$$childHead.password;
        curUser.firstname=$scope.$$childHead.firstname;
        curUser.lastname=$scope.$$childHead.lastname;
        curUser.email=$scope.$$childHead.email;
        curUser.phone=$scope.$$childHead.phone;
        curUser.location=$scope.$$childHead.location;
        localStorage.setItem('curUser',JSON.stringify(curUser));
        var userlist=JSON.parse(localStorage.getItem('users')||"[]");
        userlist[userlist.findIndex(a=>a.username===curName)]=curUser;
        localStorage.setItem('users',JSON.stringify(userlist));;
        $scope.username=curUser.username;
        $scope.password=curUser.password;
        $scope.firstname=curUser.firstname;
        $scope.lastname=curUser.lastname;
        $scope.email=curUser.email;
        $scope.phone=curUser.phone;
        $scope.location=curUser.location;
        $scope.value='edit';
        $scope.show=false;
    }
});
app.controller('signupCtrl',function($scope){
        $scope.subsign=function(){
        var userlist=JSON.parse(localStorage.getItem('users')||'[]');
        console.log(userlist);
        var user={};
        user['username']=$scope.username;
        user['password']=$scope.password;
        user['firstname']=$scope.firstname;
        user['lastname']=$scope.lastname;
        user['email']=$scope.email;
        user['phone']=$scope.phone;
        user['location']=$scope.location;
        userlist.push(user);
        localStorage.setItem('users',JSON.stringify(userlist));
        window.location.href='app.html#/';
    }
});
app.controller('homeCtrl',function($scope){
   $scope.clearFcCur=clearFcCur;
});

function clearFcCur(){
    console.log("current user cleared!");
    localStorage.removeItem('curUser');
}


function LoginCheck(){
    if(localStorage.getItem('curUser')===undefined||localStorage.getItem('curUser')===null){
        window.location.href='app.html#/';
        alert("Please login!");
    }
}