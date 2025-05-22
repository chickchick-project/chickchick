import { SubTabSwitcher } from "../../tabs/SubTabs";
import { getRenderableActivitySubTabItems } from "./activitySection.helper";
import { ActivityData } from "../sections.type";

export const ActivitySection = ({ data }: { data: ActivityData }) => {
  return (
    <SubTabSwitcher
      defaultKey="myReviews"
      tabs={getRenderableActivitySubTabItems(data)}
    />
  );
};
