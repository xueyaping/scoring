/**
 * Created by xue on 2016/10/21.
 */
var config = {
    authDomain: "scoring-2.wilddog.com",
    syncURL: "https://scoring-2.wilddogio.com" //输入节点 URL
};
wilddog.initializeApp(config,"DEFAULT");
var ref = wilddog.sync().ref('https://scoring-2.wilddogio.com/');
//初始化


var regInfo=new Array();
var oldScore=new Array();
var newScore=new Array();
var usersA=new Array();
var usersB=new Array();
var roles=new Array();
var scoArr=new Array();
var addSco=new Array();
var remArray=new Array();
var e,h,i, j,aLink,ok;
var actors=[];
var curIds=[];
var raters=[];
var scoreIds=[];
var uemail,ids,scoRcd;
var date=new Date();
var yearStr=date.getFullYear();
var monthStr=date.getMonth()+1;
var dateStr=date.getDate();
var timeStr=date.getHours();
var minuteStr=date.getMinutes();
timeStr=yearStr+"-"+monthStr+"-"+dateStr+"-"+timeStr+":"+minuteStr;
//用户注册
function register(){
    nemail=$('#em').val();
    npassword=$('#pd').val();
    nname = $('#user_name').val();
    obj = $('#product').val();
    group = $('#t_group').val();
    actors=$(":radio:checked").val();//角色选择
    if(actors=="leader"){
        var txt,code="supervisor",yes;
        var person=prompt("请输入验证码"," ");
        if (person!=''&&person!=null&&person==code){
           /* txt="身份验证成功";
          layer.msg(txt);*/
            yes= true
        }else{
            txt="身份验证失败";
            layer.msg(txt,{icon:5});
            yes= false
        }
        /*layer.prompt(function(val, index){
            layer.msg('得到了'+val);
            layer.close(index);
        });*/
}
   if( yes!=false) wilddog.auth().createUserWithEmailAndPassword (nemail,npassword).then(function(user){
        var x = 20;
        var y = 0;
       var rand = parseInt(Math.random() * (x - y + 1) + y);
       // var rand=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,19,20];

        var regRef=wilddog.sync().ref("user/info");
       // var leaderRef=wilddog.sync().ref("user/leader");
        regInfo={name:nname,email:nemail,obj:obj,group:group,id:obj+group,role:actors};
        objid=regInfo.obj;
        grpid=regInfo.group;
        rmail=regInfo.email;
        keyname=regInfo.name;
        roles=regInfo.role;
        userids = parseInt( regInfo.obj) + parseInt( regInfo.group)+ rand;//产品组+技术组+随机数
        regRef.child(keyname).update({ids:userids,name:keyname,email:rmail,obj:objid,group:grpid,role:roles,score:""});
       layer.msg("恭喜您，注册成功",{icon:1,time:2000});
       setTimeout("location.reload()",2000);

   }).catch(function(error){

        if (error.code == "email_taken") {
            layer.msg('此邮箱已经被注册',{icon:5});
        }
        else if (error.code == "invalid_email"){
            //tip.show();
            //tiptxt.text('邮箱或密码不合法');
            layer.msg('邮箱或密码不合法',{icon:5});
        }else{
            /*tip.show();
             tiptxt.text("注册失败!")*/
            layer.msg('很遗憾，注册失败');
        }
    })

}

//用户登录
function logIn(){
    oemail=$('#em').val();
    opassword=$('#pd').val();
    wilddog.auth().signInWithEmailAndPassword(oemail,opassword).then(
        function(user) {
            if(user.email=='zxc@gsola.cn'){
                top.location = "./admin.html";
            }else{
                top.location = "./panel.html";
            }
            $("#logInForm").submit();
            console.log(user);
        }).catch(function(err){
            if(oemail.length==0||opassword.length==0){
                layer.msg("邮箱或密码不能为空", {icon:2});

            }else{
                layer.msg('邮箱或密码有误',{icon:2});
                console.log("",err)
            }
        })
}

//-------------------------------帐户设置------------------------------------
function findPassword(){
    femail=$("#findPassword").val();
    ref.resetPassword({email:femail},function(err,data){
        goodtip=$("#errAlert");
        if(err==null){
            console.log("success",data);
            goodtip.text("密码已发送到注册邮箱");
            goodtip.css({
                "color":"#3c763d",
                "border-color":"#d6e9c6",
                "background-color":"#F5FFFA",
                "padding":"5px"
            });

        }else{
            goodtip.text("邮箱有误，请重新输入");
            goodtip.css({
                "color":"#c7254e",
                "background-color":"#f9f2f4",
                "padding":"5px"
            })

        }
    })
}
function editPassword(){//重设密码
    //editemail=$("#editPassword").val();
    //opw=$("#oldPassword").val();
    npw=$("#newPassword").val();

    wilddog.auth().currentUser.updatePassword(npw).then(function(){
            layer.alert("密码修改成功")

    }).catch(function(error){
        layer.alert("update password failed.",error)
    });
    /* wilddog.auth().currentUser.updatePassword(npw)
       .then(function(){
           layer.alert("密码修改成功");改

    }).catch(function(err){
           layer.alert("update password failed.",err)
    });
   wilddog.auth().sendPasswordResetEmail("771305416@qq.com").then(function(){
        layer.alert("已发送重设密码邮件.",err)
    }).catch(function(error){
        layer.alert("link email failed.",error)
    });*/
}
/*function changeEmail(){//修改邮箱
    omail=$("#chgEmail").val();
    nmail=$("#newEmail").val();
    cpw=$("#chgPassword").val();
    wilddog.auth().currentUser.updateEmail((nmail),function(err){
        if(err==null){
            layer.alert("密码修改成功",function(login){
                login="./index.html";
                layer.open(login);
            });
        }else{
            layer.alert("update password failed.")
        }
    });
}*/
//---------------------------------------end//


//获取匹配当前登录用户的ids值，作为筛选条件
function currentIds(user){
    var curRef = wilddog.sync().ref("user/info");
    curRef.orderByValue().on('value', function (snapshot) {
        snapshot.forEach(function (snap) {

            userKey = snap.key();
            userVal = snap.val();
            uemail=user.email;
            i=0;
                if (uemail == userVal.email) {
                   usersB[i++] ={name:userVal.email,ids:userVal.ids,role:userVal.role};
                    raters[uemail]= userVal.name;
                    curIds[uemail] = userVal.ids;
                    actors[uemail]= userVal.role;
                    console.log(curIds[uemail],raters[uemail],actors[uemail]);
                }

        })
    })
}

//curIds传参(前登录用户ids值)，筛选与当前用户同一范围的用户数据
function listShow(user,curIds,actors){

        i=0;
        var logRef = wilddog.sync().ref("user/info");
        logRef.orderByKey().once('value', function (snapshot) {
            snapshot.forEach(function (snap) {
                userKey = snap.key();
                userVal = snap.val();
                keyname = userVal.name;
                keyIds = userVal.ids;

                usersA[++i] = {name: userVal.name, ids: userVal.ids, score: userVal.score, role: userVal.role};
                if(uemail !== userVal.email){

                        if (actors[uemail] == "leader" && usersA[i].role == "leader") {//当前登录用户是主管或项目经理时，生成主管互评表
                            timeTitle = yearStr + "年" + monthStr + "月份 ";
                            $("#groupTxt").text(timeTitle + "主管级互评");
                            td1 = "<td id='td1'>" + $("tr").length + "</td>";
                            td2 = "<td id='td2'>" + usersA[i].name + "</td>";
                            td3 = "<td id='td3'><input contentEditable='true' type='number' maxlength='2' name='num' style='border: none;width: 30px'>" + '' + "</input></td>";
                            td4 = "<td>" + usersA[i].score + "</td>";
                            if (userVal.role !== null) {
                                $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td3 + td4 + "</tr>");
                            }

                        } else {


                            if (( userVal.ids <= curIds[uemail] + 50 && userVal.ids < 500) && (userVal.ids >= curIds[uemail] - 50) && actors[uemail] !== "leader") {
                                timeTitle = yearStr + "年" + monthStr + "月份 ";
                                $("#groupTxt").text(timeTitle + "员工互评");
                                td1 = "<td id='td1'>" + $("tr").length + "</td>";
                                td2 = "<td id='td2'>" + usersA[i].name + "</td>";
                                td3 = "<td id='td3'><input contentEditable='true' type='number' maxlength='2' name='num' style='border: none;width:30px'>" + '' + "</input></td>";
                                td4 = "<td>" + usersA[i].score + "</td>";
                                $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td3 + td4 + "</tr>");
                            } else if (( userVal.ids <= curIds[uemail] + 10 && userVal.ids > 500 ) && (userVal.ids >= curIds[uemail] - 10) && actors[uemail] == "staff" && userVal.role == "staff") {
                                timeTitle = yearStr + "年" + monthStr + "月份 ";
                                $("#groupTxt").text(timeTitle + "员工互评");
                                td1 = "<td id='td1'>" + $("tr").length + "</td>";
                                td2 = "<td id='td2'>" + usersA[i].name + "</td>";
                                td3 = "<td id='td3'><input contentEditable='true' type='number' maxlength='2' name='num' style='border: none;width:30px'>" + '' + "</input></td>";
                                td4 = "<td>" + usersA[i].score + "</td>";
                                $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td3 + td4 + "</tr>");
                                $(td1).text(i);
                            } else {
                                if (curIds[uemail] == "99999") {//当前登录者为管理员账户时，所以成员
                                    td1 = "<td id='td1'>" + $("tr").length + "</td>";
                                    td2 = "<td id='td2'>" + usersA[i].name + "</td>";
                                    td3 = "<td id='td3'><input contentEditable='true' type='number' name='num' style='border: none;'>" + '' + "</input></td>";
                                    td4 = "<td>" + usersA[i].score + "</td>";
                                    timeTitle = yearStr + "年" + monthStr + "月份 ";
                                    $("#groupTxt").text(timeTitle + "互评数据管理");
                                    $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td4 + "</tr>");
                                }

                            }
                        }
                    }

            });

        });





            /*if (( userVal.ids < curIds[uemail] + 50 ) && (userVal.ids > curIds[uemail] - 50)) {//与当前登录者为同一项目组或技术组成员
                $("#groupTxt").text(" 项目组 / 技术组成员互评");

                td1 = "<td>" + usersA[i].ids + "</td>";
                td2 = "<td>" + usersA[i].name + "</td>";
                td3 = "<td><input contentEditable='true' type='number' max='10' min='0' style='border: none;'>" + '' + "</input></td>";
                td4 = "<td>" + usersA[i].score+"</td>";

                if (uemail !== userVal.email) {
                    $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td3 + td4 + "</tr>");

                }

            }else{
                if (curIds[uemail]=="99999") {//当前登录者为管理员账户时，所以成员
             timeTitle=yearStr+"年"+monthStr+"月份 ";
             $("#groupTxt").text(timeTitle+"用户数据管理");

             td1 = "<td id='td1'>" + usersA[i].ids + "</td>";
             td2 = "<td id='td2'>" + usersA[i].name + "</td>";
             td3 = "<td id='td4'>" + usersA[i].score+ "</td>";
             td4 = "<td id='td3'>" + '' + "</td>";

             if (uemail !== userVal.email) {
             $("#userList").append("<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2+td3+  "</tr>");

             }

             }
             }
*/


}
//-------------------点击查看按钮，显示个人打分记录--------------------
$(document).delegate('#sortBtn', 'click',"disabled", function(trKey){
    trKey=this.class;
    trKeystr = String(trKey);
    trAll=$("#"+trKeystr);
    sortRecord(trKey);//点击查看按钮，显示个人打分记录

});
function sortRecord(trKey){//点击查看，显示个人打分记录
    i=0;j=0;
    var scoRef = wilddog.sync().ref("scoring");
    scoRef.orderByKey().once("value", function (snapshot) {
        snapshot.forEach(function (snap) {
            //存储当前节点的Key值（当前登录打分者的ids）
            oldScore[j++] = {ids:snap.val().ids,name:snap.val().name,sco:snap.val().sco,rater:snap.val().rater};

        });

        //j=0;
        a=0;i=0;

        for (j=0;j<oldScore.length; j++) {

            if (trKey==oldScore[j].name){//查找是否存在与当前登录打分者匹配的数据

                // var Id = oldScore[j].ids;
                var Name = oldScore[j].name;
                var Score = oldScore[j].sco;
                var Rater =oldScore[j].rater;

                /*  if(!scoreIds[Id]){        //objArr[Id]未定义或不存在
                 scoreIds[Id]  = {};
                 }
                 */
                if(!scoreIds[Name]){     //objArr[Id][Name]未定义或不存在
                    scoreIds[Name] = {};
                    scoreIds[Name].Score = [];
                }
                if(!scoreIds[Name]){     //objArr[Id][Name]未定义或不存在
                    scoreIds[Name] = {};
                    scoreIds[Name].Score = [];
                }

                scoreIds[Name].Score.push(Score);//对象数组中共同字段 分组
                console.log(scoreIds);
                tips =oldScore[j].name+ ": "  +scoreIds[Name].Score+" 分";
                // tipsdiv="<p class='list-group-item'>"+tips+"</p>";
                // $(tipsdiv).appendTo("."+trKey);
                // layer.alert(tips, '"."+trKey');
                $("."+trKey).find("#td4").text(scoreIds[Name].Score );

            }

        }


    });
}
//--------------end-------------------------------------------------*/


//---------------------查看全部打分记录，并计算分数--------------------
function reCord(usersA){
    j=0;
        var scoRef = wilddog.sync().ref("scoring");
        scoRef.orderByKey().once("value", function (snapshot) {
            snapshot.forEach(function (snap) {
                userKey=snap.val().name;
                userIds=snap.val().ids;
                //存储当前节点的Key值（当前登录打分者的ids）
                oldScore[j++] = {
                    ids: snap.val().ids,
                    name: snap.val().name,
                    sco: snap.val().sco,
                    rater: snap.val().rater,
                    time: snap.val().time
                };

            });
            if(oldScore.length>0){
                $("#userTab").css("display","none");
                $("#scoTab").css("display","block");
                TH="<th>"+"姓 名"+"</th>"+ "<th>"+"分 数"+"</th>"+ "<th>"+"评分人"+"</th>"+ "<th>"+"互评得分"+"</th>";
                $("#scoList").append( "<tr>"+TH+ "</tr>");
            }else{

               layer.msg("共 "+oldScore.length+"条 数据");
            }

            for (j = 0; j < oldScore.length; j++) {
                //查找是否存在与当前登录打分者匹配的数据
                    var Name = oldScore[j].name;
                    var Score = oldScore[j].sco;
                    var Rater = oldScore[j].rater;

                    if (!scoreIds[Name]) {     //objArr[Id][Name]未定义或不存在
                        scoreIds[Name] = {};
                        scoreIds[Name].Score = [];
                        scoreIds[Name].Rater = [];

                    }

                    scoreIds[Name].Score.push(Score);//对象数组中共同字段 分组
                    console.log(scoreIds);
                    scoreIds[Name].Rater.push(Rater);
                    console.log(scoreIds);

                //tips = oldScore[j].name + ": " + scoreIds[Name].Score + " 分";
            }
            for(var key in  scoreIds){
                var sum=0;
                for(i=0;i<scoreIds[key]["Score"].length;i++){
                    sum+=parseInt(scoreIds[key]["Score"][i]);
                    result=sum/scoreIds[key]["Score"].length
                }
                td1 = "<td id='td1'>" + key+ "</td>";
                td2 = "<td id='td2'>" + scoreIds[key].Score + "</td>";
                td3 = "<td id='td3'>" + scoreIds[key].Rater + "</td>";
                td4 = "<td id='td4'>" +result+ "</td>";
                TR="<tr class='" + userKey + "' id='" + userKey + "'>" + td1 + td2 + td3 + td4 + "</tr>";

                $("#scoList").append(TR);

                // $("#scoList").append( key+' : '+ scoreIds[key].Score+'<br />');
               var resultRef= wilddog.sync().ref("user/info");
                for(i=1;i<usersA.length;i++){
                    if(key==usersA[i].name){
                        a=1;
                    }
                }
                if(a==1){
                    resultRef.child(key).update({score:result});
                    console.log(key+result);

                }

            }
            $("#countData").css("display","none")

        });


}
//--------------------------end-----------------------------------/

function outPut(aLink,strKey){
    i=0;
    $("tr:not(:first)").each(function(k,v) {//通过each循环每个div节点
        strKey = (this.id);//获取id值
        strKeystr = String(strKey);
        trAll = $("#" + strKeystr);
        tdAll = trAll.find("td");
       // tdAll3 = trAll.find("input");
        td1 = tdAll.eq(0).text();
        td2 = tdAll.eq(1).text();
        td3 = tdAll.eq(2).text();
       // td3 = tdAll3.val();
        td4 = tdAll.eq(3).text();
        td5 = tdAll.eq(4).text();
        newScore[i++] = {ids: td1, name: td2, sco: td3};

    });


    for(i=0;i<newScore.length;i++){
        id=newScore[i].ids;name=newScore[i].name;sco=newScore[i].sco;
        addSco[i] ="\n"+id+","+name+","+sco;
        str=encodeURIComponent(addSco);
        aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;
    }
   // str =  encodeURIComponent(str);

    //aLink.click()


}
//------------------清除打分数据
function removeSco(){
    var remScoreRef=wilddog.sync().ref("scoring");//清除实时打分记录
    var remRaterRef=wilddog.sync().ref("rater");//清除当前用户组打分记录
    remScoreRef.set({});
    remRaterRef.set({});

    h=0;
    var remInfoRef=wilddog.sync().ref("user/info/"); //---清楚用户信息下的得分结果
    remInfoRef.on('value', function (snapshot) {
        snapshot.forEach(function (snap) {
            userKey = snap.key();
            userVal = snap.val();
            keyIds = userVal.ids;
            remArray[++h] = {key: userKey};
        });
        for(h=1;h<remArray.length;h++){
            keyname = remArray[h].key;
            remInfoRef.child(keyname).update({score: ''})
        }
    });

}
//----------提交当前登录用户打分数据，推送到Scoring节点下-----------------

function scoreSnap(strKey){
    i=0;
    $("tr:not(:first)").each(function(k,v){//通过each循环每个div节点
        strKey = (this.id);//获取id值
        strKeystr = String(strKey);
        trAll = $("#" + strKeystr);
        tdAll = trAll.find("td");
        tdAll3=trAll.find("input");
        td1 = tdAll.eq(0).text();
        td2 = tdAll.eq(1).text();
       // td3 = tdAll.eq(2).text();
        td3=tdAll3.val();
        td4 = tdAll.eq(3).text();
        td5 = tdAll.eq(4).text();
        if(td3!==''&&td3!==null){
            if(td3>0&&td3<11){
                newScore[i++] = {ids: td1, name: td2, sco: td3};//保存行内单元格数据
            }else{
                layer.msg('请输入0-10之间的数值！',{icon:2});
              ok=1
            }

        }else{
            layer.msg('分值不能为空,请输入数字！',{icon:2});
           ok=2
        }

    });
   // i=0;
    if(ok!==1&&ok!==2){

        i=0;j=0;
        var rater = wilddog.sync().ref("rater");
        var raterUpRef = wilddog.sync().ref("rater/" + curIds[uemail]);

        rater.once("value", function (snapshot) {
            snapshot.forEach(function (snap) {
                //存储当前节点的Key值（当前登录打分者的ids）
                oldScore[j++] = {rater:snap.key()};
            });
            //j=0;
            a=0;i=0;
            for (j=0;j<oldScore.length; j++) {
                if (curIds[uemail]==oldScore[j].rater){//查找当前登录用户操作记录是否已存在
                    console.log(oldScore[j].rater+' '+curIds[uemail]);
                    a=1;
                }

            }
            if(a!==1){//如果不存在，以当前登录用户为子节点推送数据
                for (i=0;i<newScore.length; i++) {
                    raterUpRef.push({
                        name: newScore[i].name,
                        ids: newScore[i].ids,
                        sco: newScore[i].sco,
                        rater: curIds[uemail],
                        count: newScore.length,
                        time: timeStr
                    });
                    //var newSco = newScore[i].name;
                    var snapRef = wilddog.sync().ref("scoring");
                    snapRef.push({//不分组，直接推送打分数据
                        name: newScore[i].name,
                        ids: newScore[i].ids,
                        sco: newScore[i].sco,
                        rater: raters[uemail],
                        count: newScore.length,
                        time: timeStr
                    });
                    layer.alert("提交成功");

                }

            }else{
                layer.alert("数据已存在，不能重复提交");
            }

        });

    }else{

    }



}//-------------------------end-----------------------------------------/



$(document).ready(function() { //------------------------------表单验证---------------------------//
    $('#logInForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {

            email: {
                validators: {
                    emailAddress: {
                        message: '输入不是有效的电子邮件地址'
                    },
                    stringLength: {
                        min: 3,
                        max: 30,
                        message: '字符长度在6-16位之间'
                    },
                    notEmpty: {
                        message: '邮箱地址不能为空'
                    }

                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 16,
                        message: '字符长度在6-16位之间'
                    }
                }
            }
        }
    });
    $('#regForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {

            email: {
                validators: {
                    emailAddress: {
                        message: '输入不是有效的电子邮件地址'
                    },
                    stringLength: {
                        min: 3,
                        max: 30,
                        message: '字符长度在6-16位之间'
                    },
                    notEmpty: {
                        message: '邮箱地址不能为空'
                    }

                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 16,
                        message: '字符长度在6-16位之间'
                    }
                }
            },
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 16,
                        message: '请输入真实姓'
                    }
                }
            }
        }
    });

    //Validate the form manually------点击按钮验证表单，实现用户登录
    $("#btn-logIn").click(function (e) {
        e.preventDefault();
        $('#logInForm').bootstrapValidator('validate');
        logIn();
    });
    $("#btn-reg").click(function (e) {
        e.preventDefault();
        $('#regForm').bootstrapValidator('validate');
            register();
    });

    //监听登录状态
    var stopListen=wilddog.auth().onAuthStateChanged(function (user) {
        if (user!==null) {
           $('#userName').text(user.email);//当前登录用户
            listShow(currentIds(user),curIds,actors);//显示与当前登录用户同组成员信息

            $("#score-btn").click(function(strKey){//提交分数推送数据
              scoreSnap(strKey);
                //$("#score-btn").attr("disabled", true);
                setTimeout("location.reload()",2000);
            });
            $("#sort-btn").click(function(e) {//查询分数记录生成表格
                //viewScoKey();
                 reCord(usersA);
                $("#sort-btn").attr("disabled", true);
            });
            $("#fresh-btn").click(function(){//刷新表格
                window.location.reload();
            });
            $("table").mousemove(function(){
                $("#output").css("display","block");
            });//显示导出图标

            $("#remove-btn").click(function(e) {
                e.preventDefault();
                layer.confirm(' 确定要清除所有数据吗？', {
                    btn: ['清除', '不'] //按钮
                }, function () {
                    layer.msg('正在清除……请稍等', {icon: 1, time: 2000},removeSco());

                    layer.load();
                    setTimeout(function(){
                        layer.closeAll('loading');
                    }, 8000);
                    setTimeout(function() {
                        layer.msg('数据清除成功', {icon: 1, time: 2000},location.reload());
                    },10000)
                }, function () {
                    layer.msg('操作已取消！', {
                        icon: 1,
                        time: 2000
                    });
                });
            });
            /*-----------------修改密码-------------------*/

            $("#edit-btn").click(function(e){
                e.preventDefault();
                editPassword();
            });

        }
        else {
            console.log('no user');
            $('#userName').text("用户已离线！请重新登录");
            $('#userName').click(function(){
                top.location="./index.html"
            });

        }

       });
    $("#logout-btn").click(function () {
        stopListen();

        layer.confirm('您确定要退出当前登录？', {
            btn: ['退出','不'] //按钮
        }, function(){
            layer.msg('您已退出登录！',{
                icon:1,
                time: 1000, //20s后自动关闭
                content: [ wilddog.auth().signOut(),top.location = "./index.html"]

            });
        }, function(){
            layer.msg('取消退出', {
                icon:1,
                time: 1000
            });
        });
    });
});
