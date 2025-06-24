package com.lawyer.utils;

public class ExamtoolConstants {

	public final static String qp_choice_type1 = "Either";
	public final static String qp_type1 = "Normal";
	public final static String qp_dec_type1 = "Normal";
	public final static String qp_dec_type2 = "Objective";
	public final static String qp_type2 = "Part wise";
	public final static String qp_choice_type2 = "All";

	public final static String email_validation = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
	public final static String comma_restriction = "^[^,]*$";
	public final static String splitting_by_bracket = "\\s*\\([A-D]\\)\\.";

	public final static String attempts_based_distinction = "AttemptsBased";
	public final static String points_based_distinction = "PointsBased";

	public final static String jwt_token_valid = "valid";
	public final static String jwt_token_malformed = "malformed";
	public final static String jwt_token_expired = "expired";
	public final static String jwt_token_empty = "empty";
	public final static String jwt_token_unsupported = "unsupported";

	public final static String email_otp_auth_purpose = "ExternalMarksModify";
	public final static String otp_auth_purpose_moderation = "ModerationModify";

	public final static int PHOTO_WIDTH = 200;
	public final static int PHOTO_HEIGHT = 260;
	public final static int QUES_WIDTH = 400;
	public final static int QUES_HEIGHT = 260;
	public final static int SIGN_WIDTH = 140;
	public final static int SIGN_HEIGHT = 60;
	public final static int BIOMETRIC_WIDTH = 100;
	public final static int BIOMETRIC_HEIGHT = 100;

	public final static String ALLBATCHES = "All Batches";
	public final static String ALLBRANCHES = "All Branches";
	public final static String BATCH = "batch";
	public final static String ALLSECTIONS = "All Sections";
	public static final String TOPIC_NAME = "adhikrit";
	public static final String GROUP_ID = "adhikrit_group";

	final static public String exam_mode_online = "online";
	final static public String exam_mode_offline = "offline";
	final static public String zero_marks = "0";

	final static public String allotment_type_system = "System";
	final static public String allotment_type_manual = "Manual";

	final static public String elective_type1 = "Core Cores";
	final static public String elective_type2 = "Professional Elective";
	final static public String elective_type3 = "Elective";
	final static public String degree_type1 = "Major";
	final static public String degree_type2 = "Minor";
	final static public String degree_type3 = "Honor";
	final static public String alphabets_numbers_space_regex = "^[A-Za-z0-9\\s]+$";
	final static public String special_characters_exclude_space = "^[\\w\\s\\-]*$";
	final static public String regex_for_allowed_special_chars = "^[\\w\\s-+()]*$";
	final static public String regex_for_restrict_special_chars = "^[a-zA-Z0-9+\\-() ]+$";
	final static public String omr_type1 = "Manual";
	final static public String omr_type2 = "Digital";
	final static public String valiadate_only_numbers_regex = "^[0-9]+$";
	final static public String exam_type1 = "Internal";
	final static public String exam_type2 = "External";
	final static public String student_status_new = "New";
	final static public String student_status_promotion = "Promotion";
	final static public String student_status_modify = "Modify";
	final static public String student_status_rejoin = "Rejoin";
	final static public String student_status_blocked = "Blocked";
	final static public String student_status_unblocked = "Unblocked";
	final static public String student_status1 = "Active";
	final static public String student_status2 = "Detained";
	final static public String student_status3 = "Left";
	final static public String student_status4 = "Transfer";
	final static public String student_status5 = "Demise";
	final static public String result_pass = "Pass";
	final static public String result_fail = "Fail";
	final static public String result_absent = "AB";
	final static public String year_type_current = "current";
	final static public String year_type_previous = "previous";
	final static public String fee_type_regular = "Regular";
	final static public String fee_type_supple = "Supple";
	final static public String fee_type_challenge = "Challenging";
	final static public String fee_type_condonation = "Condonation";
	final static public String fee_type_transcript = "Transcript";
	final static public String fee_type_re_valuation = "Re-valuation";
	final static public String fee_type_re_couting = "Re-counting";
	final static public String special_branch_key = "specialBranch";
	final static public String all_programs = "All Programs";
	final static public String all_subjects = "All Subjects";
	final static public String all_rollnos = "All Rollnos";
	final static public String mid_one = "MID I";
	final static public String mid_two = "MID II";
	final static public String subject_type_theory = "Theory";
	final static public String subject_type_mandatory = "Mandatory";
	final static public String subject_type_practical = "Practical";
	final static public String subject_type_seminor = "Seminor";
	final static public String subject_type_project = "Project";
	final static public String subject_type_drawing = "Drawing";
	final static public String semester_v = "V SEMESTER";
	final static public String viva_marks_type = "vivaMarks";
	final static public String subjective_marks_type = "subjectMarks";
	final static public String objective_marks_type = "objectiveMarks";
	final static public String lab_marks_type = "labProjectMarks";
	final static public String internal_marks_type = "internal";
	final static public String assignment_marks_type = "assignmentMarks";
	final static public String dayToDay_marks_type = "dayToDay";
	final static public String depComm_marks_type = "departmentCommittee";
	final static public String projectSupervisor_marks_type = "projectSupervisor";
	final static public String seminar_marks_type = "seminar";
	final static public String presentation_marks_type = "presentation";

	final static public String splitup_for_final = "Final";
	final static public String splitup_for_midI = "MID I";
	final static public String splitup_for_midII = "MID II";
	final static public String splitup_for_midImidII = "MID I&MID II";

	final static public String published_status = "Published";

	final static public String present_status = "Present";
	final static public String absent_status = "Absent";
	final static public String absent_status1 = "ABSENT";
	final static public String malpractice_status = "Malpractice";

	final static public String regex_numbers_and_decimal = "^[0-9\\.]+$";

	final static public String valuation_1 = "Valuation-1";
	final static public String valuation_2 = "Valuation-2";
	final static public String valuation_3 = "Valuation-3";

}
