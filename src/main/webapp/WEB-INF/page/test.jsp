<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<jsp:include page="common/meta.jsp"></jsp:include>
<html>
<script type="text/javascript" src="/EmplPortal/lib/jquery-1.9.1.js"></script>
<script type="text/javascript" src="/EmplPortal/lib/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
	function login() {
		$.ajax({
			url : "sets/login/certify",
			data : 'param={"username":"' + $("#username").val()
					+ '","password":"' + $("#password").val() + '"}',
			success : function(msg) {
				alert(1);
				alert(msg.status);
				alert(msg.employer.employerId);
			}
		});
	}
	function position_init() {
		$.ajax({
			url : "position/init",
			success : function(msg) {
				alert(msg);
			}
		});
	}
	function refresh(obj) {
		obj.src = "sets/login/validateCode?" + Math.random();
	}
	function position_getExtra() {
		alert(root+"/sets/position/getExtra");
		$.ajax({
			url : root+"/sets/position/getExtra",
			type : "post",
			data : '{"programLanguage" : "java","level" : "2","positionName" : "aaa","requiresDesc" : "gggggggggg"}',
			success : function(msg) {
// 				alert(msg);
			}
		});
	}
	function position_exhistory()
	{
		//alert(root+"/sets/position/extrasHistory");
		$.ajax({
			url : root+"/sets/position/extrasHistory",
			type : "post",
			data : {"programLanguage" : "100","level" : "3","pageSize" : "5","requestPage" : "1"},
			success : function(msg) {
// 				alert(msg);
				console.log(msg);
			}
		});
	}
	
	function position_commit()
	{
		$.ajax({
			url : "sets/position/commit",
			type : "post",
			data : 'param='+encodeURI('{"programLanguage" : "100","level" : "2","positionName" : "aaa","requiresDesc" : "gggggggggg","extrasIds":["1","2","3"],"interviewIds":["1","2","3","4"]}'),
			success : function(msg) {
				alert(msg);
			}
		});
	}
	
</script>
<body onload="position_exhistory()">
	<!-- 	<h2>Hello World!</h2> -->
	<!-- 	<a href="login.action?param=12345">login!</a> -->
	<form action="sets/login/certify.action" method="post">
		username: <input type="text" id="username" name="username" /><br>
		password: <input type="text" id="password" name="password" /><br>
		<input type="button" value="submit" onclick="login();" />
	</form>

	<form action="checkServlet" method="post">
		<label>输入验证码</label><br /> <input type="text" name="randomCode" /><img
			title="点击更换" onclick="javascript:refresh(this);"
			src="sets/login/validateCode"><br /> <input type="submit"
			value="submit">
	</form>
	<form action=""></form>
</body>
</html>
