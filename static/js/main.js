// event
function ongoingEvents() {
  document.getElementById("eventOngoing").style.display = "block"
  document.getElementById("eventDone").style.display = "none"
  //- console.log("ongoing~~~")
}
function endedEvents() {
  document.getElementById("eventOngoing").style.display = "none"
  document.getElementById("eventDone").style.display = "block"
  // window.location.reload()
  //- console.log("ended~~~~~")
}
// // event
// coupon
function couponRegister() {
  document.getElementById("couponRegist").style.display = "block"
  document.getElementById("ticketRegist").style.display = "none"
  //- console.log("ongoing~~~")
}
function ticketRegister() {
  document.getElementById("couponRegist").style.display = "none"
  document.getElementById("ticketRegist").style.display = "block"
  // window.location.reload()
  //- console.log("ended~~~~~")
}
// //coupon

