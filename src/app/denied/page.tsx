export default function Denied() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-red-950 text-red-50 text-center p-4">
      <h1 className="text-6xl mb-4">✋ PARE AÍ!</h1>
      <p className="text-2xl max-w-md">
        Essa é uma área restrita da API. <br/>
        Sem a chave secreta, você não passa.
      </p>
      <span className="text-9xl mt-8">👮‍♂️</span>
    </div>
  );
}

