<template>
    <div class="content content-auth">
      <div class="row d-flex justify-content-center ml-0 mr-0">
        <div class="col-lg-4 auth-container">
          <router-view/>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "AuthLayout",
}
</script>
<style lang="scss">
  body{
    background-color: #f4f2f2 !important;
  }
  form{
    text-align: center;
    input.invalid{
      border-color: #cc0808;
      color: #cc0808;
    }
    .helper-text{
      color: #730606;
    }
  }
  .auth-container {
    margin-top: 100px;
  }
  .card-background{
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    img{
      -webkit-filter: blur(2px);
      -ms-filter: blur(2px);
      filter: blur(2px);
    }
  }
</style>