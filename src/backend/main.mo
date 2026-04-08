import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ContentMixin "mixins/content-management-api";
import Types "types/content-management";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  let lectures = Map.empty<Types.LectureId, Types.Lecture>();
  let notes = Map.empty<Types.NoteId, Types.Note>();
  let counters = { var nextLectureId : Nat = 0; var nextNoteId : Nat = 0 };

  include ContentMixin(accessControlState, lectures, notes, counters);
};
