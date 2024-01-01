import { Link as ReactLink } from "react-router-dom";

export function Button({ className, children }) {
  return <button className={"btn m-1 " + className}>{children}</button>;
}

export function Link({ className, to, children }) {
  return (
    <ReactLink className={"btn " + className} to={to}>
      {children}
    </ReactLink>
  );
}
