import { useMediaQuery } from "react-responsive";

interface EditIconProps {
  onClick: () => void;
}

const EditIcon: React.FC<EditIconProps> = ({ onClick }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <svg
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      xmlns="http://www.w3.org/2000/svg"
      width={isMobile ? "1rem" : "1.25rem"}
      height={isMobile ? "1rem" : "1.25rem"}
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
      </g>
    </svg>
  );
};

export default EditIcon;
