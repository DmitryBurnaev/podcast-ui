<template>
  <footer class="footer footer-black  footer-white ">
    <div class="container-fluid">
      <div class="row">
        <nav class="footer-nav">
          <ul>
            <li><a href="/" target="_blank">Podcasts</a></li>
          </ul>
        </nav>
        <div class="credits ml-auto">
          <span class="copyright">
            © <script>
              document.write(new Date().getFullYear())
            </script>, made with <i class="fa fa-heart heart"></i> by developer
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
}
</script>
