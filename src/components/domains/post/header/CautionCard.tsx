export default function CautionCard() {
  return (
    <section className="w-full p-4 flex flex-col gap-2 bg-gray-300 rounded-xl">
      <h2 className="text-black-100 font-semibold text-body-1">
        글 작성에 유의해주세요.
      </h2>
      <p className="text-black-300 font-medium text-label-1">
        욕설 및 비방글 작성 시 서비스 이용이 정지되는 등 불이익을 받으실 수
        있습니다.
      </p>
    </section>
  );
}
