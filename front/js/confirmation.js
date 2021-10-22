const str = window.location.href;
const url = new URL(str);
const orderId = url.searchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;