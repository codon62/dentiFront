<template>
  <div class="loading-container">
    <!--    <div class="loading-dots" />-->
    <div class="loading">
      <div class="loading-1" />
      <div class="loading-2" />
      <div class="loading-3" />
      <div class="loading-4" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingDots',
};
</script>

<style scoped lang="scss">
.loading-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.loading-dots {
  @include icon(15px);

  position: relative;
  border-radius: 50%;
  background-color: #0868f1;
  color: #0868f1;
}

.loading-dots::before,
.loading-dots::after {
  @include icon(15px);

  content: '';
  position: absolute;
  top: 0;
  border-radius: 50%;
  background-color: #0868f1;
  color: #0868f1;
}

.loading-dots::before {
  left: -25px;
  animation: dotCollisionBefore 2s infinite ease-in;
}

.loading-dots::after {
  left: 25px;
  animation: dotCollisionAfter 2s infinite ease-in;
  animation-delay: 1s;
}

@keyframes dotCollisionBefore {
  0%,
  50%,
  75%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-15px);
  }
}

@keyframes dotCollisionAfter {
  0%,
  50%,
  75%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(15px);
  }
}

.loading {
  height: 60px;
  width: 110px;
  border-left: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
  box-sizing: border-box;
}
@keyframes loading {
  0% {
    background-color: #caedfd;
  }

  30% {
    background-color: rgba(103, 133, 210, 0.49);
  }
  50% {
    height: 50px;
    margin-top: 0;
  }
  80% {
    background-color: #008cd7;
  }
  100% {
    background-color: #0868f1;
  }
}
@mixin inner() {
  height: 10px;
  width: 20px;
  background-color: #fff;
  display: inline-block;
  margin-top: 40px;
  -webkit-animation: loading 2.5s infinite;
  -moz-animation: loading 2.5s infinite;
  -o-animation: loading 2.5s infinite;
  animation: loading 2.5s infinite;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
@mixin loading() {
  @for $i from 1 through 10 {
    .loading-#{$i} {
      @include inner();
      -webkit-animation-delay: calc($i / 4) + s;
      animation-delay: calc($i / 4) + s;
    }
  }
}
.loading {
  @include loading();
}
</style>
