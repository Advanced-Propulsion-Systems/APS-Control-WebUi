import { Link as ReactLink } from "react-router-dom";

export function Button(props) {
  return (
    <button {...props} className={"btn m-1 " + props.className}>
      {props.children}
    </button>
  );
}

export function Link(props) {
  return (
    <ReactLink {...props} className={"btn " + props.className}>
      {props.children}
    </ReactLink>
  );
}
