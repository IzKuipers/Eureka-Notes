<script lang="ts">
  import { BuildHash, EurekaVersion } from "../../ts/api/stores";
</script>

<div class="dialog-body">
  <div class="header">
    <span class="lucide icon-brain"></span>
    <div>
      <h1>EUREKA</h1>
      <p>Created by IzKuipers</p>
    </div>
  </div>
  <p>
    Eureka is an <a href="https://github.com/IzKuipers/Eureka-Notes" target="_blank">open source</a> utilitarian note taking application
    written for simplicity and convenience.
  </p>
  <table>
    <tbody>
      <tr>
        <td>Version</td>
        <td>{$EurekaVersion}</td>
      </tr>
      <tr>
        <td>Commit Hash</td>
        <td>{$BuildHash}</td>
      </tr>
      <tr>
        <td>Server</td>
        <td>{import.meta.env.EUREKA_SERVER_URL}</td>
      </tr>
      <tr>
        <td>Frontend</td>
        <td>{location.hostname}</td>
      </tr>
    </tbody>
  </table>
</div>
