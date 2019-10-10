import Axios, { AxiosResponse } from "axios";

import { Settings } from "tinymce";

export interface ITinyMCESettings extends Settings {
  image_advtab: boolean;
}

export const init = (buttons: string = "", setup?: (editor: any) => void): ITinyMCESettings => {
  return {
    plugins: "print preview fullpage searchreplace autolink directionality visualblocks"
      + " visualchars fullscreen image link media template codesample table charmap hr pagebreak"
      + " nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help",
    toolbar:
      buttons + " formatselect | bold italic strikethrough forecolor backcolor permanentpen"
      + " formatpainter | link image media | alignleft aligncenter alignright alignjustify |"
      + " numlist bullist outdent indent | removeformat | addcomment",
    image_advtab: true,
    images_upload_handler: (blobInfo: any, success: (msg: string) => void, failure: (msg: string) => void): void => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      Axios.post("/resource/upload", formData, { headers: { "content-type": "multipart/form-data" } }).then((response: AxiosResponse<{ location: string }>) => {
        success(response.data.location);
      }).catch((error: any) => {
        failure("Something went wrong. Try again");
      });
    },
    file_picker_callback: (callback: (filename: string, meta: any) => void, value: string, meta: any): void => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "*");

      input.onchange = () => {
        if (input.files.length < 0) { return; }
        const formData = new FormData();
        formData.append("file", input.files[0]);
        Axios.post("/resource/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response: AxiosResponse<{ location: string }>) => {
          callback(response.data.location, { title: input.files[0].name });
        });
      };

      input.click();
    },
    setup,
  };
};
