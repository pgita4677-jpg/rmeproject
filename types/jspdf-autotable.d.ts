// types/jspdf-autotable.d.ts
declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  // minimal typing yang kita butuhkan
  export default function autoTable(doc: jsPDF, options: any): void;

  // menambahkan interface augmentasi untuk jsPDF
  declare module "jspdf" {
    interface jsPDF {
      // lastAutoTable biasanya berisi finalY
      lastAutoTable?: {
        finalY?: number;
      };
    }
  }
}
