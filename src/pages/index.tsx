import Image from "next/image";
import appPreviewImage from "../assets/app-template-image.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImage from "../assets/user-avatar-example.png";
import iconCheckImage from "../assets/icon.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("")

  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      })
      const { code } = response.data
      await navigator.clipboard.writeText(code)

      alert("Bolão foi criado com sucesso, o código foi copiado para a área de tranferência!")
      setPoolTitle("")
    } catch (error) {
      console.log(error)
      alert("falha ao criar o bolão, tente novamente!")
    }
    
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" quality={100} />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu pŕoprio bolão da copa do mundo e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image
            src={usersAvatarExampleImage}
            alt="Avatar images"
            quality={100}
          />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já
            estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 divide-x grid grid-cols-2 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImage} alt="Icon Check Image" quality={100} />
            <section className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </section>
          </div>
          <div className="flex items-center justify-end gap-6">
            <Image src={iconCheckImage} alt="Icon Check Image" quality={100} />
            <section className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </section>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
