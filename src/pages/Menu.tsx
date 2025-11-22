import { Button, Offcanvas } from "alope-ui";
import { useState } from "react";

export default function MenuPage() {
  const [instructionOffCanvas, setInstructionOffCanvas] = useState(false);
  const [courseOffCanvas, setCourseOffCanvas] = useState(false);

  return (
    <section className="bg-[url(/bg.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white max-w-5xl mx-auto">
        <div className="flex sm:flex-row flex-col items-center gap-3 mb-10">
          <img src="/images/img14.png" className="w-20 sm:w-28" />
          <h1 className="text-4xl font-bold">Tangram Game</h1>
          <img src="/images/img1.png" className="w-28 sm:flex hidden" />
        </div>

        <h2 className="text-xl font-bold mb-5">Menu</h2>

        <Button to={"/game"} variantType="primary" className="mb-5" size="lg">
          Play Game
        </Button>

        <Button
          variantType="warning"
          className="mb-5"
          size="lg"
          onClick={() =>
            // alert(
            //   "🧩 Cara Bermain:\n\n• Seret dan susun semua bentuk ke posisi bayangan.\n• Klik sebuah shape untuk memutarnya 90°.\n• Jika posisi & rotasi benar, shape akan terkunci.\n• Selesaikan semua untuk membentuk rumah!"
            // )

            setInstructionOffCanvas(true)
          }
        >
          Instruksi
        </Button>

        <Button
          variantType="success"
          className="mb-5"
          size="lg"
          onClick={() =>
            // alert(
            //   "📘 Pengertian Bentuk:\n\n1. Jajargenjang: Memiliki dua pasang sisi sejajar dan sama panjang.\n2. Persegi: Empat sisi sama panjang & empat sudut 90°.\n3. Segitiga: Bangun datar dengan tiga sisi & tiga sudut."
            // )

            setCourseOffCanvas(true)
          }
        >
          Pengertian Bentuk
        </Button>

        <div className="flex gap-5 mt-10">
          <img src="/images/img10.png" className="w-24 sm:w-28" />
          <img src="/images/img11.png" className="w-24 sm:w-28" />
          <img src="/images/img12.png" className="w-28 sm:flex hidden" />
        </div>
      </div>

      <Offcanvas
        isOpen={instructionOffCanvas}
        onClose={() => setInstructionOffCanvas(false)}
        title="🧩 Cara Bermain"
        position="left"
      >
        <ul className="list-disc pl-5">
          <li>Seret dan susun semua bentuk ke posisi bayangan.</li>
          <li>Klik sebuah shape untuk memutarnya 90°</li>
          <li>Jika posisi & rotasi benar, shape akan terkunci.</li>
          <li>Selesaikan semua untuk menyusun tangram rumah!</li>
        </ul>

        <div className="flex gap-5 mt-10">
          <img src="/images/img10.png" className="w-28" />
          <img src="/images/img11.png" className="w-28" />
          <img src="/images/img12.png" className="w-28" />
        </div>
      </Offcanvas>

      <Offcanvas
        isOpen={courseOffCanvas}
        onClose={() => setCourseOffCanvas(false)}
        title="📘 Pengertian Bentuk"
        position="left"
      >
        <ol className="list-decimal pl-5">
          <li>
            Jajargenjang: Memiliki dua pasang sisi sejajar dan sama panjang.
          </li>
          <li>Persegi: Empat sisi sama panjang & empat sudut 90°.</li>
          <li>Segitiga: Bangun datar dengan tiga sisi & tiga sudut.</li>
        </ol>

        <div className="flex gap-5 mt-10">
          <img src="/images/img16.png" className="w-28" />
          <img src="/images/img8.png" className="w-28" />
          <img src="/images/img4.png" className="w-28" />
        </div>
      </Offcanvas>
    </section>
  );
}
