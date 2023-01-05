var jpdbBaseURL ="http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var DBname="SCHOOL-DB";
var relName="STUDENT-TABLE";
var connToken="90938203|-31949272852211249|90954826";

$("#rollno").focus();

function saveRecNo2LS(resultObj)
{
    var lvData= JSON.parse(resultObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getRollNoasJsonObj()
{
    var rollno=$("#rollno").val("");
    var jsonStr={
        id:rollno
    };
    return JSON.stringify(jsonStr);
}
function enableInput() {
    $("#name").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#birthdate").prop("disabled", false);
    $("#enrdate").prop("disabled", false);
    $("#reset").prop("disabled", false)

}
function fillData(resultObj)
{
    var data = JSON.parse(resultObj.data);
    var data1 = JSON.stringify(data.record)
    var data2 = JSON.parse(data1)
    $("#rollno").val(data2.rollno);
    $("#name").val(data2.name);

    $("#class").val(data2.class);
    $("#address").val(data2.address);
    $("#birthdate").val(data2.birthdate);
    $("#enrdate").val(data2.enrdate);
    jQuery.ajaxSetup({ async: true });
    saveRecNo2LS(resultObj)
    $("#rollno").prop("disabled", true)
    $("#savebutton").prop("disabled", true)
    $("#rollno").prop("disabled", true)
    $("#change").prop("disabled", false)

    enableInput()
}
function checkrecord() 
{
    var rollnoVar = $("#rollno").val();
    if (rollnoVar === "") {
        alert("Student Roll no is required");
        $("#name").focus();
        return "";
    }

    var jsonObj = {
        rollno: rollnoVar
    }
    var jsonStr = JSON.stringify(jsonObj);
    if (jsonStr === "") {
        return;
    }
    var getReqStr = createGET_BY_KEYRequest("90937884|-31949272429615463|90952116", "Student", "Student-Rel", jsonStr, true, true);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getReqStr, "http://api.login2explore.com:5577", "/api/irl");
    if (resultObj.status !=200) {
        $("#savebutton").prop("disabled", false)
        enableInput()
    }
    else{
        $("#savebutton").prop("disabled", true)
        fillData(resultObj)
        return true;
    }
}
function resetForm() 
{
    $("#rollno").val("");
    $("#studentName").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrdate").val("");
    $("#rollno").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#rollno").focus();
}

function validateData()
{ var rollno,studentName,classes,birthdate,address,enrdate;
    rollno=$("#rollno").val();
    studentName=("#studentName").val();
    classes=$("#class").val();
    birthdate=$("#birthdate").val();
    address=$("#address").val();
    enrdate=$("#enrdate").val();
    if (rollno === "") 
    {
        alert("Roll no. Required Value");
        $("#rollno").focus();
        return "";
    }
    if ( studentName=== "") 
    {
        alert("Student Name Required Value");
        $("#studentName").focus();
        return "";
    }
    if (birthdate === "") 
    {
        alert("Date of Birth Required Value");
        $("#birthdate").focus();
        return "";
    }
    if (address === "") 
    {
        alert("Address Required Value");
        $("#address").focus();
        return "";
    }
    if (enrdate === "") 
    {
        alert("Enrollment Date Required Value");
        $("#enrdate").focus();
        return "";
    }
    if (classes === "") 
    {
        alert("Class. Required Value");
        $("#class").focus();
        return "";
    }
    var jsonStrObj= 
    {
        Id: rollno,
        Name: studentName,
        class: classes,
        dob: birthdate,
        add: address,
        enr: enrdate
    }
    return JSON.stringify(jsonStrObj);
}


function getStudent()
{
    var rollnoJsonObj=getRollNoasJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,DBname,relName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl (getRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status===400)
    {
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#studentName").focus();
    }else if(resJsonObj.status===200)
    {
        $("#rollno").prop("disabled",true);
        fillData(resJsonObj);
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#studentName").focus();
    }

}


function saveStudent()
{
    var jsonStr = validateData();
    if (jsonStr === "") 
    {
    return;
    }
    var putRequest = createPUTRequest(connToken,jsonStr,DBname,relName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl (putRequest,jpdbBaseURL,jpdbIML);
    if (resultObj.status == 200) {
        alert("Data added Successfully")
    }
    else if (resultObj.status == 401) {
        alert("Invalid Token")
    }
    else if (resultObj.status == 400) {
        alert("Something went wrong,Try after some time")
    }
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empId").focus();
}

function updateStudent()
{
    $('#change').prop('disabled',true);
    jsonChg=validateData();
    var updateRequest = createUPDATERecordRequest( connToken , jsonChg , DBname , relName , localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#empId").focus();
}
