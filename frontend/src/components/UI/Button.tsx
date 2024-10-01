interface ButtonProps {
  clickHandler(): any;
  btnText: string;
  styles?: object;
}
export default function Button(btnProps: ButtonProps) {
  return (
    <button
      className="border-none p-1 px-4 bg-blue-primary rounded-xl text-base hover:bg-blue-hover delay-100"
      onClick={btnProps.clickHandler}
      style={btnProps.styles}
    >
      {btnProps.btnText}
    </button>
  );
}
