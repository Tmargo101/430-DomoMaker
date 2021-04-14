const handleLogin = (event) => {
  event.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

const handleSignup = (event) => {
  event.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }
    
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};
