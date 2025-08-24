import { useFavoriteItem } from "../hooks/useFavorites";


function FavoriteButton({
  type,
  id,
  noteIdx,
  defaultContent = "",
}) {
  const { favorite, alert, toggleFavorite, isFavorited } = useFavoriteItem(
    type,
    id,
    noteIdx,
    defaultContent
  );

  return (
    <>
      <button className="btn btn-square btn-ghost" onClick={toggleFavorite}>
        {isFavorited ? (
          <svg
            className="size-[1.2em] text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="red"
              stroke="red"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </g>
          </svg>
        ) : (
          <svg
            className="size-[1.2em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </g>
          </svg>
        )}
      </button>
      {alert.show && (
        <div
          role="alert"
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ pointerEvents: "none" }}
        >
          <div className="alert alert-error flex items-centerrounded shadow-lg px-6 py-4 border border-red-300 w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{alert.message}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default FavoriteButton;
