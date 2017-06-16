<template>
  <div class="container">
    <h1>Snip</h1>
    <h5>dead simple URL shortener</h5>
    <p class="error" m-if="error">Invalid URL</p>
    <input type="url" placeholder="URL" m-model="url" m-on:keyup.enter="submit"/>
    <button class="hide-desktop" m-on:click="submit">Submit</button>
  </div>
</template>
<style scoped>
  .container {
    max-width: 300px;
  }

  h1 {
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 70px;
    color: #1098F7;
  }

  h5 {
    color: #666666;
    font-weight: 300;
  }

  button {
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    background-color: #2CF6B3;
    width: 100%;
    font-weight: 700;
    font-size: 15px;
  }

  .error {
    color: #E82F22;
  }
</style>
<script>
  var urlRE = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  var protocolRE = /^https?\:\/\//;

  var addProtocol = function(url) {
    if(protocolRE.test(url) === false) {
      return "http://" + url;
    } else {
      return url;
    }
  }

  exports = {
    data: function() {
      return {
        url: "",
        error: false
      }
    },
    methods: {
      submit: function() {
        var url = addProtocol(this.get("url"));

        if(urlRE.test(url) === true) {
          // Remove error message
          if(this.get("error") === true) {
            this.set("error", false);
          }

          // Log
          console.log("recieved " + url);
        } else {
          // Show error message
          this.set("error", true);
        }
      }
    }
  }
</script>
