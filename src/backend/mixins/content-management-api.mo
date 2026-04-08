import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ContentLib "../lib/content-management";
import Types "../types/content-management";

mixin (
  accessControlState : AccessControl.AccessControlState,
  lectures : Map.Map<Types.LectureId, Types.Lecture>,
  notes : Map.Map<Types.NoteId, Types.Note>,
  counters : { var nextLectureId : Nat; var nextNoteId : Nat },
) {
  // Instructor-only: upload lecture with video file
  public shared ({ caller }) func uploadLecture(input : Types.LectureInput) : async Types.Lecture {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the instructor can upload lectures");
    };
    let lecture = ContentLib.addLecture(lectures, counters.nextLectureId, input);
    counters.nextLectureId += 1;
    lecture;
  };

  // Instructor-only: delete a lecture (file reference removed, blob GC'd automatically)
  public shared ({ caller }) func deleteLecture(id : Types.LectureId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the instructor can delete lectures");
    };
    ContentLib.deleteLecture(lectures, id);
  };

  // Instructor-only: upload note with file
  public shared ({ caller }) func uploadNote(input : Types.NoteInput) : async Types.Note {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the instructor can upload notes");
    };
    let note = ContentLib.addNote(notes, counters.nextNoteId, input);
    counters.nextNoteId += 1;
    note;
  };

  // Instructor-only: delete a note (file reference removed, blob GC'd automatically)
  public shared ({ caller }) func deleteNote(id : Types.NoteId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the instructor can delete notes");
    };
    ContentLib.deleteNote(notes, id);
  };

  // Students: list all lectures
  public query func listLectures() : async [Types.Lecture] {
    ContentLib.listLectures(lectures);
  };

  // Students: get lecture by ID
  public query func getLecture(id : Types.LectureId) : async ?Types.Lecture {
    ContentLib.getLecture(lectures, id);
  };

  // Students: list all notes
  public query func listNotes() : async [Types.Note] {
    ContentLib.listNotes(notes);
  };

  // Students: get note by ID
  public query func getNote(id : Types.NoteId) : async ?Types.Note {
    ContentLib.getNote(notes, id);
  };
};
