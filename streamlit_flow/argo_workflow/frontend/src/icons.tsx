import Icons from "./img/icons.svg";

type IconProps = {
  name: string;
  color: string;
  size: number;
}

const Icon = ({ name, color, size}: IconProps) => {
  let class_name = `argo-node-icon icon-${name}`
  if(name === "running"){
    class_name += " icon-spinner"
  }
  
  return (
    <div>
      <svg className={class_name} color={color} width={size} height={size}>
        <use xlinkHref={`${Icons}#${name}`} />
      </svg>
    </div>
  );
}

export default Icon;