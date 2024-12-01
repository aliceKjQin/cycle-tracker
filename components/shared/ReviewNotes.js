import Loading from "./Loading";
import { useNote } from "@/app/dashboard/useNote";

export default function ReviewNotes({
  user,
  isDemo,
  targetMonthNotes, // Optional: Notes specific to the target month
}) {
  const {deleteNote, loading: loadingDelete, success, error } = useNote(user?.uid);


  return (
    <div className="w-full p-4 bg-indigo-200 rounded-lg">
      {isDemo && <h2 className="font-bold text-lg mb-4">
        <i className="fa-regular fa-note-sticky mr-2"></i>Review Notes
      </h2>}
      {loadingDelete && !targetMonthNotes ? (
        <Loading />
      ) : (
        <>
          {success && (
            <p className="text-emerald-500 text-center transition duration-200 text-sm">
              {success} <i className="fa-regular fa-square-check fa-lg"></i>
            </p>
          )}
          {error && (
            <p className=" text-red-500 text-center transition duration-200 text-sm">
              {error} <i class="fa-regular fa-circle-xmark fa-lg "></i>
            </p>
          )}
          <div className="flex flex-col gap-4">
            {/* Display Notes */}
            {targetMonthNotes.length > 0 ? (
              targetMonthNotes.map((note, index) => (
                <div
                  key={index}
                  className="p-3 ring-2 ring-indigo-300 bg-pink-50 text-stone-700 shadow-sm rounded-lg flex flex-col"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">{note.displayedDate}</p>
                    {!isDemo && (
                      <button onClick={() => deleteNote(note.date)}>
                        <i className="fa-solid fa-trash-can text-stone-400 hover:text-red-400"></i>
                      </button>
                    )}
                  </div>
                  <p className="mt-1">{note.note}</p>
                </div>
              ))
            ) : (
              <p>No notes available to review.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
