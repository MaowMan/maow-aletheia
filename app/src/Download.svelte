<script>
  export let meta, code;
  const parser = new DOMParser();
  import { Icon, Button, Progress , Snackbar } from "svelma";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import Progressbar from "./Progressbar.svelte";
  let processing = {
    status: false,
    value: null,
    maxvalue: null,
  };
  async function check(target) {
    const url = new URL(
      `${meta.proxy}/https://nhentai.net/api/gallery/${target}`
    );
    const header = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-requested-with": "XMLHttpRequest",
    });
    const request = await fetch(url, {
      method: "GET",
      headers: header,
      mode: "cors",
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return null;
      });
    if (request === null || request.error != undefined) {
      return null;
    } else {
      return request;
    }
  }
  async function download(api) {
    console.log(api);
    const gallery_code = api.media_id;
    const pages = api.images.pages;
    processing.value = 5;
    processing.maxvalue = pages.length + 15;
    //console.log(processing);
    let page = 0;
    let downloaders = [];
    let result = [];
    let seq = [];
    pages.forEach((element) => {
      const filetype = element.t === "j" ? "jpg" : "png";
      page += 1;
      const url = new URL(`${meta.server}`);
      const body = {
        gallery: `${gallery_code}`,
        page: `${page}`,
        filetype: `${filetype}`,
      };
      downloaders.push(
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "image",
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            //console.log(response);
            const reader = response.body.getReader();
            return new ReadableStream({
              start(controller) {
                return pump();
                function pump() {
                  return reader.read().then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    controller.enqueue(value);
                    return pump();
                  });
                }
              },
            });
          })
          .then((stream) => {
            return new Response(stream);
          })
          .then((response) => {
            return response.blob();
          })
          .then((img) => {
            processing.value += 1;
            //console.log(processing);
            seq.push(body.page);
            result.push(img);
          })
          .catch((error) => {
            console.log(error);
          })
      );
    });
    await Promise.all(downloaders);
    return {
      result: result,
      seq: seq,
    };
  }
  async function compress(content, api, seq) {
    let zip = new JSZip();
    let count = 0;
    content.forEach((element) => {
      const filetype = api.images.pages[count].t === "j" ? "jpg" : "png";
      zip.file(`${seq[count]}.${filetype}`, element, { base64: true });
      count += 1;
    });
    await zip.generateAsync({ type: "blob" }).then((result) => {
      processing.value += 10;
      console.log("done!");
      saveAs(result, `${api.id}.zip`);
    });
    return 0;
  }
  async function main() {
    processing.status = true;
    const api = await check(code);
    if (api === null) {
      processing.status = false;
      processing.value = null;
      processing.maxvalue = null;
      Snackbar.create({ message: '神的語言錯誤',});
      return 0;
    }
    const content = await download(api);
    const result = content.result;
    const seq = content.seq;
    const final = await compress(result, api, seq);
    processing.status = false;
    processing.value = null;
    processing.maxvalue = null;
    Snackbar.create({ message: "下載完成",});
    console.log(processing);
  }
</script>

{#if processing.status}
  <Progressbar
    bind:maxvalue={processing.maxvalue}
    bind:value={processing.value} />
{:else}
  <div class="buttons">
    <Button iconLeft="download" type="is-link" on:click={() => main()}>
      下載
    </Button>
  </div>
{/if}
