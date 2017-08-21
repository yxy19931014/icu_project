var url='http://192.168.6.6:8088/ICUMobileInterface.asmx/CallInterface';

var inputs=document.getElementsByTagName('input');
			for(var i=0;i<inputs.length;i++){
				inputs[i].setAttribute('placeholder','请输入');
			}
//获取参数
function GetRequest(url) {   
   var theRequest = new Object();   
   if (url.indexOf("?") != -1) {   
      var str = url.substr(1);   
      strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
      }   
   }   
   return theRequest;   
}   

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//获取参数中的值
			var MRN=GetRequest(location.search).MRN?GetRequest(location.search).MRN:'';
			var patientName=unescape(GetRequest(location.search).PatientName)?unescape(GetRequest(location.search).PatientName):'';
			var patientNumber=GetRequest(location.search).PatientNumber?GetRequest(location.search).PatientNumber:'';
			document.getElementById('titleId').innerHTML=patientName;
//选择患者
var DeptCode=GetRequest(location.search).DeptCode?GetRequest(location.search).DeptCode:JSON.parse(localStorage.getItem('loginInfo')).DeptCode;
mui('.mui-title').on('tap','#downSelect',function(){
	mui.ajax({
		url:url,
		type:'post',
		data:{
			msgBody:JSON.stringify({
                DeptCode:DeptCode,//deptCode
                StrWhere:''
            }),                   
            msgHeader:JSON.stringify({
                ServerName:'GetInPatientList',
                Format: 'json',
                CallOperator: '',
                Certificate:'123456'
            })
		},
		dataType:'json',
		success:function(data){
			if(data.Code==0){
				var datas=data.Contents;
				for(var i=0;i<datas.length;i++){
					if(datas[i].PatientNumber==patientNumber){
						document.getElementById('currentBed').innerHTML=datas[i].Bed;
						document.getElementById('currentName').innerHTML=datas[i].PatientName;
						datas.splice(i,1);
						var html=template('selectPatient',{list:datas});
						document.getElementById('historyData').innerHTML=html;
					}
					document.getElementsByClassName('singleBox')[i].addEventListener('tap',function(){
						var thisMRN=this.getAttribute('MRN');
						var thisName=this.getAttribute('PatientName');
						var thisNumber=this.getAttribute('PatientNumber');
						location.href='observation.html?MRN='+thisMRN+'&PatientName='+ escape(thisName)+'&PatientNumber='+thisNumber;
					})
				}
			
			}
		}
	})
});

