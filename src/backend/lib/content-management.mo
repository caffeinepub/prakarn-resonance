import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/content-management";

module {
  public func addLecture(
    lectures : Map.Map<Types.LectureId, Types.Lecture>,
    nextId : Nat,
    input : Types.LectureInput,
  ) : Types.Lecture {
    let lecture : Types.Lecture = {
      id = nextId;
      title = input.title;
      description = input.description;
      topic = input.topic;
      videoFile = input.videoFile;
      uploadedAt = Time.now();
    };
    lectures.add(nextId, lecture);
    lecture;
  };

  public func deleteLecture(
    lectures : Map.Map<Types.LectureId, Types.Lecture>,
    id : Types.LectureId,
  ) : () {
    lectures.remove(id);
  };

  public func getLecture(
    lectures : Map.Map<Types.LectureId, Types.Lecture>,
    id : Types.LectureId,
  ) : ?Types.Lecture {
    lectures.get(id);
  };

  public func listLectures(
    lectures : Map.Map<Types.LectureId, Types.Lecture>,
  ) : [Types.Lecture] {
    lectures.values().toArray();
  };

  public func addNote(
    notes : Map.Map<Types.NoteId, Types.Note>,
    nextId : Nat,
    input : Types.NoteInput,
  ) : Types.Note {
    let note : Types.Note = {
      id = nextId;
      title = input.title;
      description = input.description;
      topic = input.topic;
      file = input.file;
      uploadedAt = Time.now();
    };
    notes.add(nextId, note);
    note;
  };

  public func deleteNote(
    notes : Map.Map<Types.NoteId, Types.Note>,
    id : Types.NoteId,
  ) : () {
    notes.remove(id);
  };

  public func getNote(
    notes : Map.Map<Types.NoteId, Types.Note>,
    id : Types.NoteId,
  ) : ?Types.Note {
    notes.get(id);
  };

  public func listNotes(
    notes : Map.Map<Types.NoteId, Types.Note>,
  ) : [Types.Note] {
    notes.values().toArray();
  };
};
