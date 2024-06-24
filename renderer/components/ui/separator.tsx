interface Props {
  color?: string;
}

const Separator = ({ color = "white" }: Props) => {
  return <div className={"shrink-0 h-[1px] w-full bg-" + color}></div>;
};

export default Separator;
