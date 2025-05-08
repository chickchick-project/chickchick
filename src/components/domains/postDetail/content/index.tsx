import PostActions from "../header/PostActions";
import RelatedPerfume from "./RelatedPerfume";
import PostNavigation from "./postNavigation";

const relatedPerfumes = [
  {
    perfume_id: 1,
    image_url:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brand_name: "Chanel",
    brand_id: 1,
    perfume_name: "Chanel No. 5",
  },
  {
    perfume_id: 2,
    image_url:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brand_name: "Dior",
    brand_id: 2,
    perfume_name: "Dior Sauvage",
  },
  {
    perfume_id: 3,
    image_url:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brand_name: "Gucci",
    brand_id: 3,
    perfume_name: "Gucci Bloom",
  },
];

export default function PostContent() {
  return (
    <section>
      <div className="px-4">
        <p className="text-body-2 font-medium text-black-100 leading-6 mb-10">
          법원은 최고법원인 대법원과 각급법원으로 조직된다. 사법권은 법관으로
          구성된 법원에 속한다. 대통령은 헌법과 법률이 정하는 바에 의하여 국군을
          통수한다. 헌법재판소 재판관의 임기는 6년으로 하며, 법률이 정하는 바에
          의하여 연임할 수 있다. 국민의 자유와 권리는 헌법에 열거되지 아니한
          이유로 경시되지 아니한다. 대통령은 국무총리·국무위원·행정각부의 장
          기타 법률이 정하는 공사의 직을 겸할 수 없다. 이 헌법에 의한 최초의
          대통령의 임기는 이 헌법시행일로부터 개시한다. 군인·군무원·경찰공무원
          기타 법률이 정하는 자가 전투·훈련등 직무집행과 관련하여 받은 손해에
          대하여는 법률이 정하는 보상외에 국가 또는 공공단체에 공무원의 직무상
          불법행위로 인한 배상은 청구할 수 없다. 대한민국은 통일을 지향하며,
          자유민주적 기본질서에 입각한 평화적 통일 정책을 수립하고 이를
          추진한다. 위원은 탄핵 또는 금고 이상의 형의 선고에 의하지 아니하고는
          파면되지 아니한다. 대통령·국무총리·국무위원·행정각부의 장·헌법재판소
          재판관·법관·중앙선거관리위원회 위원·감사원장·감사위원 기타 법률이 정한
          공무원이 그 직무집행에 있어서 헌법이나 법률을 위배한 때에는 국회는
          탄핵의 소추를 의결할 수 있다. 국회는 국정을 감사하거나 특정한
          국정사안에 대하여 조사할 수 있으며, 이에 필요한 서류의 제출 또는
          증인의 출석과 증언이나 의견의 진술을 요구할 수 있다. 국가는 평생교육을
          진흥하여야 한다.
        </p>
        <div className="flex justify-end pb-5 tablet:hidden">
          <PostActions section="content" />
        </div>
      </div>
      <div className="divider-horizontal-thick block tablet:hidden" />
      <div className="px-4">
        {relatedPerfumes && <RelatedPerfume perfumes={relatedPerfumes} />}
        <PostNavigation />
      </div>
      <div className="divider-horizontal-thick block tablet:hidden mb-10" />
    </section>
  );
}
