import Icons from "./img/icons.svg";
import PropTypes from 'prop-types';

const Icon = ({ name, color, size}) => {
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

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number
};

export default Icon;