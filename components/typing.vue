<template>
	<div class="chat-bubble">
		<div class="typing">
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
		</div>
	</div>
</template>

<style scoped>
.chat-bubble {
	background-color: rgba(255, 0, 211, 0.2);
	padding: 14px 28px;
	-webkit-border-radius: 20px;
	-webkit-border-bottom-left-radius: 2px;
	-moz-border-radius: 20px;
	-moz-border-radius-bottomleft: 2px;
	border-radius: 20px;
	border-bottom-left-radius: 2px;
	display: inline-block;
}
.typing {
	align-items: center;
	display: flex;
	height: 17px;
}
.typing .dot {
	animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
	background-color: #ff00d3;
	border-radius: 50%;
	height: 7px;
	margin-right: 4px;
	vertical-align: middle;
	width: 7px;
	display: inline-block;
}
.typing .dot:nth-child(1) {
	animation-delay: 200ms;
}
.typing .dot:nth-child(2) {
	animation-delay: 300ms;
}
.typing .dot:nth-child(3) {
	animation-delay: 400ms;
}
.typing .dot:last-child {
	margin-right: 0;
}

@keyframes mercuryTypingAnimation {
	0% {
		transform: translateY(0px);
		background-color: rgba(255, 0, 211, 0.9);
	}
	28% {
		transform: translateY(-7px);
		background-color: rgba(255, 0, 211, 0.6);
	}
	44% {
		transform: translateY(0px);
		background-color: rgba(255, 0, 211, 0.3);
	}
}
</style>
