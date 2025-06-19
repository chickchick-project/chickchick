import { MainContentButton } from "./MainContentButton";
import { MAIN_BUTTONS } from "./MainContentButton.constants";

export const MainContentButtons = () => {
  return (
    <div className="flex gap-7">
      {MAIN_BUTTONS.map((button, index) => (
        <MainContentButton
          key={index}
          link={button.link}
          title={button.title}
          linkText={button.linkText}
          bgImage={button.bgImage}
        />
      ))}
    </div>
  );
};
