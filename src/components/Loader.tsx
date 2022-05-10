import { memo } from "react";

interface Props {
  isLoading: boolean;
  className?: string;
}
const Loader = (props: Props) => {
  const { isLoading, className = "" } = props;

  if (isLoading) {
    return <i className={`${className} fa fa-spinner fa-spin fa-2x fa-fw`} />;
  }
  return null;
};

export default memo(Loader);
