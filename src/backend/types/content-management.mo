import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type LectureId = Nat;
  public type NoteId = Nat;

  public type Lecture = {
    id : LectureId;
    title : Text;
    description : Text;
    topic : Text;
    videoFile : Storage.ExternalBlob;
    uploadedAt : Int;
  };

  public type Note = {
    id : NoteId;
    title : Text;
    description : Text;
    topic : Text;
    file : Storage.ExternalBlob;
    uploadedAt : Int;
  };

  public type LectureInput = {
    title : Text;
    description : Text;
    topic : Text;
    videoFile : Storage.ExternalBlob;
  };

  public type NoteInput = {
    title : Text;
    description : Text;
    topic : Text;
    file : Storage.ExternalBlob;
  };
};
