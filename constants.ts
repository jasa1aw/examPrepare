
import { Question } from './types';

// ==========================================
// PARSING LOGIC
// ==========================================

const parseQuestions = (rawData: string, answerKey?: Record<number, number>): Question[] => {
  // 1. Split by "number dot" pattern (e.g., "1.", "105.")
  // We use a regex lookahead to split but keep the delimiter or just split and reconstruct
  // Regex: Split by newline followed by number and dot
  const chunks = rawData.split(/\n(?=\d+\.)/);

  const questions: Question[] = [];

  chunks.forEach((chunk) => {
    // Clean up whitespace
    const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;

    // First line is the question text
    // Remove the leading number and dot (e.g. "1. <question>Text" or "1. Text")
    let questionText = lines[0].replace(/^\d+\.\s*/, '').trim();
    
    // Remove <question> tag if present (legacy format)
    questionText = questionText.replace('<question>', '').trim();

    // The rest are options
    // Filter out lines that might be "Ответ:" (Answer keys in raw text) or empty
    let options = lines.slice(1).filter(line => !line.toLowerCase().startsWith('ответ:'));

    // If options contain labels like "a)", "b)", remove them for cleaner UI
    options = options.map(opt => opt.replace(/^[a-z]\)\s*/i, '').replace(/^\d+\.\s*/, ''));

    if (options.length > 0) {
      // Extract ID from the first line for mapping
      const idMatch = lines[0].match(/^(\d+)\./);
      const id = idMatch ? parseInt(idMatch[1]) : questions.length + 1;
      
      const q: Question = {
        id: id,
        text: questionText,
        options: options,
      };

      // Assign correct answer if key exists
      if (answerKey && answerKey[id] !== undefined) {
        // Ensure index is within bounds
        if (answerKey[id] < options.length) {
          q.correctAnswerIndex = answerKey[id];
        }
      }

      questions.push(q);
    }
  });

  return questions;
};

// ==========================================
// PHILOSOPHY DATA
// ==========================================

const PHILOSOPHY_RAW_DATA = `
1.	<question>The specificity of the mythological worldview:
The unity of man and the world
Logical representation of the world
Believing in one God
Reasoning and proving
Expressing inner side of the man

2.	<question>Philosophical worldview has its own specifics: 
based on the logical method of cognition
based on the rational level of knowledge
has its own set of concepts, categories, special terms.
is a system of knowledge
all answer are correct

3.	<question>The object of philosophy:
the man and society
the nature and the god
the being and reality
the world and the man
mind and thinking  

4.	<question>The subject of philosophy is: 
the most general laws and patterns of development and functioning of human society, thinking and  the universe
the fundamental principles of being
the Arche  
the man in the world
space and time 

5.	<question>The main divisions of philosophy: 
Sociology, culture, myth, religion
Physics, psychology, chemistry 
Science, art, moral, politics
Gnoseology, ontology, ethics, aesthetics 
Worldview, religion, mythology 

6.	<question>Which function doesn’t belong to philosophy:
Worldview
Scientific 
Ideological 
Critical 
Methodological 

7.	<question>The basic question of philosophy:
What is primary: consciousness or matter?
What is primary: egg or hen?
What is primary: man or nature?
To be or not to be?
What is the essence of life?

8.	<question>The other side of the basic question of philosophy:
Relation of thinking to being
Is there the God?
What is the meaning of life?
Who created the man?
What is reality?

9.	<question>Solution of the basic question of philosophy:
Gnosticism and agnosticism
Dualism and monism
Materialism and idealism
Naturalism and sociologism
Theism and atheism  

10.	<question>Solution of the other side of the basic question of philosophy:
Gnosticism and agnosticism
Dualism and monism
Materialism and idealism
Naturalism and sociologism
Theism and atheism  

11.	<question>Metaphysics in philosophy states:
the world is unreal 
the world is flux
the world is static, unchanging
the world is real
the world is complex

12.	<question>Dialectics in philosophy states:
the world is unreal 
the world is flux
the world is static, unchanging
the world is real
the world is complex  

13.	<question>Consciousness is state of:
mental 
perception 
sensation 
thinking 
feeling 

14.	<question>The central problem of Consciousness:
Ideality 
Reality 
Mind and body
Truth 
Qualia 

15.	<question>What does NOT belong to Sensory knowledge?          
sensations 
perceptions 
representations
reasoning
imagination

16.	<question>What does NOT belong to Rational knowledge?
concepts 
judgments 
conclusions 
intuition 
theories

17.	<question>True being according to Plato:
atoms
ideas
things
souls 
god  

18.	<question>Being according to Aristotle:
substance
predicate
quality
quantity
idea 

19.	<question>Being according to Heidegger:
essence
substance
existence
reality
ideality 

20.	<question>Human according to Social Darwinism is:
symbolic animal
organism
sentient being
moral being
social being 

21.	<question>Human according to Marxism:
symbolic animal
organism
sentient being
moral being
social being

22.	<question>Human according to Descartes:
symbolic animal
organism
rational being
moral being
social being

23.	<question>Moral is an object of study of:
axiology
epistemology
aesthetics 
ethics 
logics 

24.	<question> «Things-in itself» by Kant is
Thins we can cognize
Things we cannot cognize 
Things existing 
Things non-existing
Ideal things  

25.	<question> «noumena» by Kant is
Unknowable world 
Knowable world
Reality  
Sensual images of objects 
Existence 

26.	<question> «phenomena» by Kant is
World
Reality  
Sensual images of objects 
Essence 
Existence

27.	<question>Tengrism can be defined as:
Monotheism 
Deism   
System of beliefs 
Philosophy  
Theism 

28.	<question>Shamanism is a form of:
Spiritualism 
Totemism 
Magic   
Mythology   
Religion 

29.	<question>Combination of different Beliefs, Faiths, Thoughts in one Unique Thinking System is called:
Syncretism 
Natural philosophy 
Science    
Mythology   
Religion 

30.	<question>Levy-Bruhl explained this quality by saying that the primitive mentality obeys something he called ‘the law of participation’, which means that thoughts can be joined by connections which having nothing in common with those of our logic. What did he mean?:
Animism 
Totemism    
Mythology 
Magic
Spiritualism 

31.	<question>Kazakh nomads had various cults and rites. Which one was essential for Kazakh worldview?:
Cult of ancestors 
Cult of the Sun 
Cult of the fire    
Cult of the earth 
Cult of the sky 

32.	<question>What is the name of philosophical system of Marxism?
Objective idealism 
Subjective idealism    
Mechanical materialism 
Dialectical materialism
Metaphysical materialism

33.	<question>The central category of Marx’s Historical materialism:
Politics 
Economics    
Forms of social consciousness
Social-economic formation
Industrial relations 

34.	<question>Freedom in accordance with the teachings of Baruch Spinoza is: 
Human will
God’s will
Human action  
Recognized necessity
Natural law 

35.	<question>In the irrational philosophy of Soren Kierkegaard, the central problem is:
The essence of man
Rational thinking 
The problem of truth
Human existence
Knowledge of God

36.	<question>The ethical ideal of Nietzsche's philosophy is:
Hedonist
Christian
Muslim
Stoick
Superman

37.	<question>The main philosophical categories of Albert Camus:
Being and thinking
Absurdity and rebellion
Existence and non-existence
Essence and existence
Life and death

38.	<question>Why does Jean Paul Sartre believe that Existentialism is humanism?
Man is a free creature
Man himself determines his existence
Man loves
Man is a god-like creature
Man creates 

39.	<question>What layer of the human psyche was discovered by Sigmund Freud?
Thinking
Unconscious
Archetypes
Imagination
Memory

40.	<question>What ancient Greek philosopher believed that the main task was self-knowledge:
Plato
Socrates
Aristotle
Thales 
Plotinus 

41.	<question>Translation of word “axiology”:
Study of values.
Cosmo centrism.
Love Theo 
Pantheism
Love Humanity.

42.	<question> “There are only two substances in the beginning of the world – thinking and extended substances (dualism) is from philosophy of…
E.Kant
D.Hume
R.Descartes
J.-P.Sartre
Protagoras

43.	<question>Theory of scientific knowledge is called as…
Cognition
Epistemology 
Social philosophy 
Feeling
Axiology 

44.	<question>The object of philosophy is:
Cognition process and the place of man in this world
World in whole and the place of man in this world.
Human being.
Truth, unconcealment.
Mind at whole

45.	<question>Ethic is:
A study of nature, origin and limits of human cognition
A study of wisdom
A study of morality and moral behaviour
Branch of physics
World religion

46.	<question>Aesthetics is:
A study of nature, origin and limits of human cognition
A philosophical study of principles, moral and human behaviour
A study of beauty and art
One of the directions of Buddhism 
Philosophy as a system

47.	<question>The first historical type of outlook that is considered as is a system of ancient legends.
Philosophy 
Science 
Ethics 
Mythology 
Theology

48.	<question>Faith in the supernatural force(-s), which is based on a strong system of moral norms and the special organization of people, is…
Religion  
Ontology
Physics
Epicureanism
Substantialism

49.	<question>The Socratic ethical rationalism was formulated as
Virtue is religion
Virtue is arts
Virtue is knowledge
Virtue is war
Virtue is interests

50.	<question>One of the outstanding French existentialist:
David Hume
Georg Hegel
Albert Camus
Francis Bacon
Martin Heidegger

51.	<question>Division to Subjective spirit, Objective spirit, Absolute spirit comes from philosophy of…?
Fichte
Hegel
Kant
Shelling
Marx

52.	<question>Ancient eastern philosophy developed mainly in…
India and China
India and Japan
Persia and China
Egypt and China
India and Korea

53.	<question> “Act only on that maxim through which you can at the same time will that become a universal law” is...
the Hegel’s Categorical imperative
the Kant’s Categorical imperative
the Kant’s Hypothetical imperative
the Fichte’s Hypothetical imperative
the Hegel’s Hypothetical imperative

54.	<question>The famous Descartes’s formula “Cogito, ergo sum” is translated from Latin as
I think, therefore, I have truth
I think, therefore, I have power
I think, therefore, I have faith
I think, therefore, I exist
I think, therefore, I have values

55.	<question>Universal law in Indian philosophy, which operates in the past, present and future, is called…
Thinking
Experience
Analysis
Induction
Karma 

56.	<question>The first Fr.Baconian idol of all human mind is
Cave
Marketplace
Tribe
Theatre
Mind

57.	<question>The second Fr.Baconian idol of personal mind is
Cave
Marketplace
Tribe
Theatre
Mind

58.	<question>The third Fr.Baconian idol of mind referred to using terms and words is
Cave
Marketplace
Tribe
Theatre
Mind

59.	<question>The fourth Fr. Baconian idol of mind referred to authorities is
Cave
Marketplace
Tribe
Theatre
Mind

60.	<question>The doctrine about that knowledge is based on experience is:
Empiricism 
Rationalism 
Agnosticism 
Abstract general ideas
Complexity

61.	<question>E.Kant’s categorical imperative is about…
There’s no place like home.
The world is round.
Moral problems.
Everybody everywhere is pretty much the same.
Physical problems.

62.	<question>The translation of the word “philosophy”:
Pantheism
Love of wisdom.
Cosmo centrism.
Love Theo
Love Human

63.	<question>The word “Sophist” is translated from Greek as:
Wise man
Warrior
Judge
Man
Thinker

64.	<question>He was called «the first teacher»:
Socrates
Aristotle
Plato
Diogenes
Heraclitus

65.	<question>What beginning (Arche) did Heraclitus recognize? 
Logos (fire)
Virtue
Intelligence
Honor
Pleasure

66.	<question>What beginning did Pythagoras recognize?
Numbers
Dialectical argument
Rational instruction 
Learning from our mistakes
Breathing 

67.	<question>A teaching of Aristotle is called as…
Academicism
Peripatetism
Buddhism
Atheism
Pantheism

68.	<question>Under the Renaissance human was considered to be as
Man is a political creature.
Man is a thinking being.
Man is a religious being.
Human is a creator, artist, enriched microcosm.
Man is a sinner.

69.	<question> “I know that I know nothing” was proclaimed by…
Thales
Pythagoras
Democritus
Seneka
Socrates

70.	<question>A thinker who formulated 5 proofs of existence of God:
Augustine
Erasmus of Rotterdam.
Thomas Aquinas.
Machiavelli
Abelyar

71.	<question>Myth of the Cave was developed by:
Augustine
Erasmus of Rotterdam
Plato 
Machiavelli
Abelyar

72.	<question>Theo centrism provides that in the center of the universe is…
God 
Something mystical
Poetics
Human 
Science 

73.	<question>Defining characteristic of the religious outlook is:
Belief in art of superstitions 
Belief in contemptuous attitude to science, the denial of their validity
Belief in wisdom
Belief in the supernatural, otherworldly forces, having the opportunity to influence the course of world events
Belief in denial of human freedom, the belief that all actions originally defined by God

74.	<question> One of the main characteristics of the Renaissance is:
Atheism
Theology
Sociocentrism
Cosmocentrism
Anthropocentrism

75.	<question>Creationism is the idea that the world and mankind created by…
God 
Something mystical
Poetics
Human 
Science

76.	<question> Searching human individuality is the specific feature of Philosophy of...
Conventionalism
Life
Existentialism
Rationalism
Conformism

77.	<question>The idea that destinies of the world and people are determined by God is…
Freedom
Desire 
Canon
Providentialism
Emotions

78.	<question>Who offered psychoanalytic theory in human nature?
Leonardo da Vinci
Nikolas of Cusa
Loranzo Valla
Tomaso Campanella
Sigmund Freud

79.	<question> “Thus Spoke Zarathustra” is a work of …
R.Descartes
Nietzsche
Albert Camus
Karl Marx
Martin Heidegger

80.	<question>Branch of philosophy that studies historical knowledge and interpretation of historical process:
Philosophy of history
Logics
Ontology
History of philosophy 
Epistemology

81.	<question>The definition of social economic formation in materialism was first developed by...
Engels
Stalin 
Marx
Rousseau
Lenin

82.	<question>Who is the author of the books “Either/or”, “Fear and Trembling”?
Rousseau
Lenin
Kierkegaard
Marx
Sartre 

83.	<question>Who indicated the difference between conscious and unconscious in human mind?
Plato
Freud
Hume
Marx
Sartre

84.	<question>Aesthetical values are:
Love, friendship
Beauty, art, harmony, style
Civil rights
Freedom of word and personality
Social justice

85.	<question> “God is dead” said...
Nietzsche
Heraclitus
Plato
E.Kant
F.Hegel

86.	<question>What are the main founders of philosophy of existentialism:
Camus, Freud, Florensky
Camus, Sartre, Kierkegaard
Sartre, Spengler, Schelling B.Russel.
I.Kant, Freud, Florensky
Russel, Popper, Adler

87.	<question> «The man of absurd» according to Albert Camus is one who understands:
Essence of life
Meaning of life
Meaningless of existence
Philosophy 
Others 

88.	  <question>  «The man of rebellion» according to Albert Camus is one who states:
I think, therefore I exist
I rebel, therefore I exist
I doubt, therefore I exist
I agree, therefore I exist
I argue, therefore I exist

89.	<question>  «Borderline situations» according to Sartre is the situation when a man becomes aware of:
Purpose of his life
Problems 
Conflicts 
The meaning of his life
His coming death

90.	<question> According to Sartre: man is: 
A project of himself
A social animal
Microcosmos
Symbolic animal
God’s project
 
91.	<question> According to Sigmund Freud «Neurotic» is:
A crazy man
A healthy person with neurotic symptoms
A schizophrenic person
An anxious man 
A sick person 

92.	<question> According to Sigmund Freud «The Unconscious» is:
Ego
Super Ego 
Id 
Other Ego
Animus 
 
93.	<question> According to Carl Gustav Jung «Archetypes» are:
Symbols of Individual Unconscious 
Dreams 
Symbols of Collective Unconscious
Myths 
Spirits 
  
94.	<question>  According to Carl Gustav Jung human behaviour is determined by:
Individual unconsciousness 
Environment 
Education 
Parents 
Collective unconsciousness 

95.	<question> According to Sigmund Freud human behaviour is determined by three authorities:
Mind, will, desire
Ego, Id, Super Ego
Body, mind, soul
Father, mother, teacher
Nanny, teacher, boss
 
96.	<question> According to S. Kierkegaard the main problem of philosophy is:
Human essence
Human existence
Human origin  
Human mind 
Human body

97.	<question>  S. Kierkegaard wanted to understand why:
Man  is an animal
Man is social 
Man was thrown into the world
Man is evil
Man is kind

98.	<question>  According to F. Nietzsche human manifests themselves in: 
Will to die
Will to live
Will to power
Will to kill
Will to know

99.	<question>  According to F. Nietzsche, Superman is a person who:
Does not like people
Does not suffer
Does not like moral
Does not die
Does not believe in God
 
100.	<question>  Which ones are the typical Kazakh mythological forms?
Totemism and animism
Tengrism and shamanism
Magic and spiritualism
Polytheism and paganism
Pantheism and fetishism

101.	<question>  Philosophy of Marxism is called:
Metaphysical materialism
Dialectical materialism
Historical materialism
Objective idealism
Subjective materialism

102.	<question> Socio-political theory of Marxism is called:
Metaphysical materialism
Dialectical materialism
Historical materialism
Objective idealism
Subjective materialism

103.	<question> Philosophical method of Marxism is called:
Metaphysics
Dialectics
Deduction
Induction
Analogy

104.	<question> The idea of Communism in Marxism represents:
Class society
Classless society
Perfect society
Free society
Rich society

105.	<question> Historical type of societies in Marxism is called:
Basis and superstructure
Social economic formation
Class society
Classless society
Ideal society

106.	<question> What is Consciousness?
function of brain
reflection of reality
self-awareness
ideality
all of them

107.	<question> Elements of Consciousness according to A. G. Spirkin:
sensual
rational
value
motivation
all of them

108.	<question> Which property of consciousness describes the immaterial essence of consciousness?
ideality
intentionality
ideationality
reflection
self-awareness

109.	<question> who is Homo Sapiens?
Man with thinking
Man with feelings
Man with hands
Man with eyes
Man with soul 

110.	<question> consciousness according to theory of Dualism:
material substance
ideationality
immaterial substance
reflection
self-awareness

111.	<question> consciousness according to theory of Darwinism
property of man
ideal property
reflection of man
self-awareness
highest property of brain

112.	<question> consciousness according to theory of Logical behaviorism
thoughts
speech
acts
instincts
awareness

113.	<question> Self-consciousness is the characteristic of consciousness which describes:
intentionality
ideationality
reflection
ideality
self-awareness

114.	<question> Language is:
outer side of consciousness
inner side of consciousness
all ideas 
reflective organ 
self-awareness

115.	<question> What is Ontology? 
study of mind
study of Being
study of nature
study of god
study of man

116.	<question> What the term «metaphysics» means?
Something real
what comes after physics
something unreal
unknowable
knowable

117.	<question> What is Being?
real
category for existence
spiritual 
mental
related to humans

118.	<question>What is the problem of Being?
What is world
what is the essence of the world
what is reality
what is the god
what is the mind

119.	<question>What is Substance?
matter
independent entity
spirit
predicates of things
essence of things

120.	<question> Who said: «Being is, but there is not non-being»
Socrates 
Parmenides 
Aristotle 
Plato
Plotinus 

121.	<question> Who said: «If something denotes the essence of a thing, then it makes sense that being for it does not lie in something else»
Socrates 
Parmenides 
Aristotle 
Plato
Plotinus 

122.	<question> Who said: «Being is One»
Socrates 
Parmenides 
Aristotle 
Plato
Plotinus 

123.	<question> Who said: «Being is God»
Socrates 
Christianity 
Aristotle 
Plato
Plotinus 

124.	<question> Who said: «Being is Two»
Socrates 
Descartes 
Aristotle 
Plato
Plotinus 

125.	<question> Who said: «Being is plural»
Socrates 
Leibniz 
Aristotle 
Plato
Plotinus 

126.	<question> Who said: «Being is Absolute Idea»
Socrates 
Hegel 
Aristotle 
Plato
Plotinus 

127.	<question> Who said: «Being is Man»
Socrates 
Heidegger 
Aristotle 
Plato
Plotinus 

128.	<question> Forms of Being
Natural
All of them
Spiritual
Human
Social

129.	<question> what is Matter?
Ideal being
material being
spiritual being
divine being
social being

130.	<question>Attributes of Matter:
movement
All of them
time
space
reflection

131.	<question> Forms of Motion:
physical
all of them
chemical
biological
social

132.	<question> What is Development?
Motion from down to up
motion from simple to complex
motion  from low to high
motion from left to right
motion from up to down

133.	<question> Two concepts of Development:
Regress and progress
methaphysical and dialectical
cyclic and linear
eternal return
stagnation and change

134.	<question> types of space:
wide
Three-dimensional
narrow
virtual 
cosmos

135.	<question>types of time:
physical
all of them
psychological
biological
social

136.	<question> Philosophical category which describes visible and invisible sides of things:
Content and form
Essence and phenomenon
Cause and effect
Necessity and contingency
Possibility and reality

137.	<question> Philosophical category which describes inner and outer side of things:
Content and form
Essence and phenomenon
Cause and effect
Necessity and contingency
Possibility and reality

138.	<question> Philosophical category which describes determinism:
Content and form
Essence and phenomenon
Cause and effect
Necessity and contingency
Possibility and reality

139.	<question> What is cognition?
Thinking abt smth
mastering knowledge
working on book
imagining of smth
awareness of smth

140.	<question> What is knowledge?
books
information 
traditions
customs
opinion

141.	<question> What is common between Knowledge and Cognition?
They are the same
knowledge is the result of cognitive process
they are different
both are process
cognition needs prior knowledge

142.	<question> What is Epistemology?
Theory of knowledge
theory scientific knowledge
theory of technology
theory of methods
theory of philosophical knowledge

143.	<question> What is Gnoseology? 
Theory of knowledge
theory scientific knowledge
theory of technology
theory of methods
theory of philosophical knowledge

144.	<question> What is Gnosticism?
Cognitive pessimism
cognitive optimism
cognitive disbelief
cognitive doubts 
cognitive negation

145.	<question> What is Agnosticism?
Cognitive pessimism
cognitive optimism
cognitive disbelief
cognitive doubts 
cognitive negation

146.	<question> What is Skepticism?
Cognitive pessimism
cognitive optimism
cognitive disbelief
cognitive doubts 
cognitive negation

147.	<question> Which ideas are TRUE according to Descartes «Theory of Ideas»?
Mind ideas
innate ideas
sensory ideas
authorities’ ideas
common sense

148.	<question> Who believed that TRUTH can be proved in the process of socio-historical practice?
Hegel 
Marx 
Kant 
Bacon
Lock

149.	<question> Who believed that we can cognize only Phenomena?
Hegel 
Marx 
Kant 
Bacon
Lock

150.	<question> Type of Cognition based on Conceptual understanding the reality:
ordinary cogniton
scientific cognition
practical cognition
artistic cognition
moral cognition

151.	<question> Levels of Cognition:
Ordinary and theoretical
sensual and rational
basic and complex
lower and higher
everyday and scentisfic

152.	<question> What is Judgment?
Statement reflecting the things and their properties
logical image that reproduces the essential properties of objects
deduction from several interrelated judgments of a new judgment 
comprehend the truth by seeing it clear
integral image of an object in the unity reflected through sensations.

153.	<question> What is Concept?
Statement reflecting the things and their properties
logical image that reproduces the essential properties of objects
deduction from several interrelated judgments of a new judgment 
comprehend the truth by seeing it clear
integral image of an object in the unity reflected through sensations.

154.	<question> What is Inference?
Statement reflecting the things and their properties
logical image that reproduces the essential properties of objects
deduction from several interrelated judgments of a new judgment 
comprehend the truth by seeing it clear
integral image of an object in the unity reflected through sensations.

155.	<question> What is Intuition?
Statement reflecting the things and their properties
logical image that reproduces the essential properties of objects
deduction from several interrelated judgments of a new judgment 
comprehend the truth by seeing it clear
integral image of an object in the unity reflected through sensations.

156.	<question> What is Truth in Classical sense?
 Truth is the correspondence of knowledge to reality; 
         this is what is confirmed by experience;
         is a kind of agreement – a convention;
         usefulness of the knowledge gained; 
         effectiveness of its use in practice.

157.	<question> What is correct about Fallacy?
Deliberate distortion of truth
is the essential part of the cognitive process
Lie 
Is the fail of cognitive process
Ideological essence of cognition

158.	<question> Axiology studies:
notions
values
norms
taboos
laws

159.	<question> Absolute values: 
yin - yang
truth, beauty, good
justice, injustice
God 
Human health

160.	<question>Classification of values by carrier:
material, spiritual
individual, supra individual
economical, political
social, family
absolute, specific

161.	<question> Classification of values by existence:
material, spiritual
individual, supra individual
economical, political
social, family
absolute, specific

162.	<question> What is Ethics?
theory of art
theory of morality
theory of society
theory of religion
theory of nature

163.	<question> What is Morality?
social regulation form through beauty-ugly
social regulation form through good-bad
social regulation form through justice-injustice
social regulation form through useful-useless
social regulation form through faith-denial

164.	<question>  Why is Ethics practical science?
It is studied to know what is good
it is studied in order to become virtuous
It is studied to learn what is evil
It is studied to know more
It is studied to get wisdom

165.	<question> Difference between Morality and Mores?
No difference
difference between what is Due and what is Real
norms and ideals
good and bad
week and strong

166.	<question> Main Christian values:
Pride and humility
faith, hope, love
cupidity and generosity
lust and chastity
true and lie

167.	<question> Which one is Stoic principle?
live for pleasure and well-being
focus on what you control
live a complete and fulfilling life
usefulness, practicability, benefit
prudence, courage, justice

168.	<question> Which one is Hedonistic principle?
live for pleasure and well-being
focus on what you control
live a complete and fulfilling life
usefulness, practicability, benefit
         prudence, courage, justice

169.	<question> Which one is Pragmatic principle?
live for pleasure and well-being
focus on what you control
live a complete and fulfilling life
usefulness, practicability, benefit
         prudence, courage, justice

170.	<question> What is Epicureanism principle?
live for pleasure and well-being
focus on what you control
live a complete and fulfilling life
usefulness, practicability, benefit
         prudence, courage, justice

171.	<question> What is Eudemonism principle?
live for pleasure and well-being
focus on what you control
live a complete and fulfilling life
usefulness, practicability, benefit
         prudence, courage, justice

172.	<question> Essence of Art in classical sense:
Art is representation of reality
Art is beauty, truth, good
Art is expression of spiritual world of artist
Art is only fine art
Art is skill and mastery

173.	<question> Essence of Art in Renaissance sense
Art is representation of reality
Art is beauty, truth, good
Art is expression of spiritual world of artist
Art is only fine art
Art is skill and mastery

174.	<question> Essence of Art in 17-18 centuries:
Art is representation of reality
Art is beauty, truth, good
Art is expression of spiritual world of artist
Art is only fine art
Art is skill and mastery

175.	<question> Essence of Art in contemporary sense:
Art is representation of reality
Art is beauty, truth, good
Art is expression of spiritual world of artist
Art is only fine art
Art is skill and mastery

176.	<question> Essence of Art in traditional sense:
Art is representation of reality
Art is beauty, truth, good
Art is expression of spiritual world of artist
Art is only fine art
Art is skill and mastery

177.	<question> Aesthetic categories of Nietzsche:
sublimation
Apollonian and Dionysian
absurd
mimesis 
catharsis

178.	<question> Aesthetic categories of Freud:
sublimation
Apollonian and Dionysian
absurd
mimesis 
         catharsis

179.	<question> Aesthetic categories of Existentialism:
sublimation
Apollonian and Dionysian
absurd
mimesis 
         catharsis

180.	<question> Aesthetic categories of Plato
sublimation
Apollonian and Dionysian
absurd
mimesis 
         catharsis

181.	<question> Aesthetic categories of Aristotle
sublimation
Apollonian and Dionysian
absurd
mimesis 
         catharsis

182.	<question> Whose statement is this? – People are born free or slaves.
Erasmus 
Aristotle
Spinoza 
Rousseau
Fromm

183.	<question> Whose statement is this? – Freedom is human illusion.
Erasmus 
Aristotle
Spinoza 
Rousseau
Fromm

184.	<question> Whose statement is this? – Freedom is realized necessity.
Erasmus 
Aristotle
Spinoza 
Rousseau
Fromm

185.	<question> Whose statement is this? – Freedom is democracy and equality.
Erasmus 
Aristotle
Spinoza 
Rousseau
Fromm

186.	<question> Whose statement is this? – There is freedom from and freedom for.
Erasmus 
Aristotle
Spinoza 
Rousseau
Fromm

187.	<question> Which one describes inevitable course of things which are unavoidable:
liberalism
fatalism
determinism
voluntarism
providentialism

188.	<question> Which one describes individual, civil rights, free enterprise
liberalism
fatalism
determinism
voluntarism
providentialism

189.	<question> Which one describes that everything happens due to the objective laws
liberalism
fatalism
determinism
voluntarism
providentialism

190.	<question> Which one describes that everything happens due to somebody’s will
liberalism
fatalism
determinism
voluntarism
providentialism

191.	<question> Which one describes the everything happens due to God’s will
liberalism
fatalism
determinism
voluntarism
providentialism

192.	<question> Tick the criteria of society:
territory
all of them
self-regulation
         self-control
integrity

193.	<question> What is society?
Aggregate of individuals
Social system
community
social relations
social groups

194.	<question> Which definition of society is of Social Darwinism?
Society is social relations
society is organism
Society is geographic adaptation
Society is ideal place
Society is summation of individuals

195.	<question> Which definition of society is of Marxism?
Society is social relations
society is organism
Society is geographic adaptation
Society is ideal place
Society is summation of individuals

196.	<question> Which definition of society is of Naturalism?
Society is social relations
society is organism
Society is geographic adaptation
Society is ideal place
Society is summation of individuals

197.	<question> Which definition of society is of Utopian?
Society is social relations
society is organism
Society is geographic adaptation
Society is ideal place
Society is summation of individuals

198.	<question> Which definition of society is of Atomism?
Society is social relations
society is organism
Society is geographic adaptation
Society is ideal place
Society is summation of individuals

199.	<question> Which one is concise definition of Culture?
Scope of arts
is material and spiritual environment created by man
life style
fine manners
customs and traditions

200.	<question> What are the main characteristics of a Mass Man according to Ortega y Gasset?

responsibility
consumerism
education
high standards
hard work
`;

const PHILOSOPHY_ANSWER_KEY: Record<number, number> = {
  1: 0, 2: 4, 3: 3, 4: 0, 5: 3, 6: 1, 7: 0, 8: 0, 9: 2, 10: 0,
  11: 2, 12: 1, 13: 3, 14: 2, 15: 3, 16: 3, 17: 1, 18: 0, 19: 2, 20: 1,
  21: 4, 22: 2, 23: 3, 24: 1, 25: 0, 26: 2, 27: 0, 28: 4, 29: 0, 30: 3,
  31: 0, 32: 3, 33: 3, 34: 3, 35: 3, 36: 4, 37: 1, 38: 1, 39: 1, 40: 1,
  41: 0, 42: 2, 43: 1, 44: 1, 45: 2, 46: 2, 47: 3, 48: 0, 49: 2, 50: 2,
  51: 1, 52: 0, 53: 1, 54: 3, 55: 4, 56: 2, 57: 0, 58: 1, 59: 3, 60: 0,
  61: 2, 62: 1, 63: 0, 64: 1, 65: 0, 66: 0, 67: 1, 68: 3, 69: 4, 70: 2,
  71: 2, 72: 0, 73: 0, 74: 4, 75: 0, 76: 2, 77: 3, 78: 4, 79: 1, 80: 0,
  81: 2, 82: 2, 83: 1, 84: 1, 85: 0, 86: 1, 87: 2, 88: 1, 89: 4, 90: 0,
  91: 1, 92: 2, 93: 2, 94: 4, 95: 1, 96: 1, 97: 2, 98: 2, 99: 4, 100: 1,
  101: 1, 102: 2, 103: 1, 104: 1, 105: 1, 106: 4, 107: 4, 108: 0, 109: 0, 110: 2,
  111: 4, 112: 2, 113: 4, 114: 0, 115: 1, 116: 1, 117: 1, 118: 1, 119: 1, 120: 1,
  121: 2, 122: 1, 123: 4, 124: 1, 125: 1, 126: 1, 127: 1, 128: 1, 129: 1, 130: 1,
  131: 1, 132: 1, 133: 1, 134: 1, 135: 1, 136: 1, 137: 0, 138: 3, 139: 4, 140: 1,
  141: 1, 142: 0, 143: 0, 144: 1, 145: 0, 146: 3, 147: 1, 148: 1, 149: 2, 150: 1,
  151: 1, 152: 0, 153: 1, 154: 2, 155: 1, 156: 0, 157: 3, 158: 1, 159: 1, 160: 1,
  161: 0, 162: 1, 163: 1, 164: 1, 165: 2, 166: 1, 167: 1, 168: 0, 169: 3, 170: 0,
  171: 2, 172: 0, 173: 2, 174: 2, 175: 2, 176: 4, 177: 1, 178: 0, 179: 2, 180: 3,
  181: 4, 182: 1, 183: 4, 184: 2, 185: 3, 186: 4, 187: 1, 188: 0, 189: 2, 190: 3,
  191: 4, 192: 1, 193: 3, 194: 1, 195: 0, 196: 2, 197: 3, 198: 4, 199: 1, 200: 1
};


// ==========================================
// PSYCHOLOGY DATA
// ==========================================

const PSYCHOLOGY_RAW_DATA = `
1. What is the literal meaning of the word "psychology"?
Study of psychopathology
Study of unconsciousness
Study of consciousness
Study of the soul
Study of emotions

2. What is the main subject of general psychology?
Human’s bad emotions
Mechanisms of the functioning of the psyche
Biological processes in the brain
Social interactions
Animal’s behavior

3. Who established the first experimental psychology laboratory?
Aristotle
Wilhelm Wundt
Ivan Pavlov
Carl Jung
John Watson

4. What is the primary focus of behaviorism?
Cognitive processes
Emotional development
Observable behavior
Personality development
Neuroscience

5. What are the research methods used in modern psychology?
Myths and legends
Psychoanalysis only
Introspection and logic
Experimental and diagnostic techniques
Observations only

6. Which school of psychology focuses on the connection between stimulus and response?
Depth psychology
Behaviorism
Gestalt psychology
Cognitive psychology
Existential psychology

7. How is psychology categorized as a science?
It studies only philosophical ideas.
It observes, describes, predicts, and explains behavior and mental processes.
It focuses solely on experimental findings.
It rejects natural sciences.
It relies exclusively on introspection.

8. What is introspection?
Observing others' behavior
Looking inward at oneself
Asking questions in a survey
Conducting experiments
Recording natural events

9. Who used introspection to study consciousness?
Burrhus Skinner
Wilhelm Wundt
Abraham Maslow
Ivan Pavlov
Albert Bandura

10. Which method involves viewing behavior of others without manipulation?
Observation
Case study
Testing
Survey
Introspection

11. What type of data can be obtained through observation?
Only qualitative
Only quantitative
Both qualitative and quantitative
Neither qualitative nor quantitative
Hypothetical data

12. What is a structured survey?
Survey with random questions
Survey with a clear purpose and standardized questions
Survey that uses technical terms
Survey with no specific goal
Survey based only on demographical data

13. What are independent variables in an experiment?
Variables that remain constant
Variables that are manipulated by the researcher
Variables that are measured as outcomes
Variables that cannot change
Randomly selected variables

14. In a psychological experiment, what is a dependent variable?
A variable that is manipulated by the researcher
A variable that remains constant throughout the study
A variable that is measured as the outcome of the experiment
A variable that cannot change under any circumstances
A variable selected randomly without control

15. What is the first step in the scientific method?
Propose a hypothesis
Observation
Publish results
Build a theory
Test a variable

16. What is the main purpose of using methods in psychology?
To avoid scientific rules
To study unrelated phenomena
To manipulate behavior
To teach ethical principles
To reach a specific research aim

17. What defines the observation method in psychology?
Direct manipulation of variables
Recording behavior as it naturally occurs
Asking participants structured questions
Analyzing dreams and fantasies
Conducting long-term case histories

18. What is typical for a case study in psychology?
Short questionnaires given to random large samples
In-depth analysis of a single person or a small group
Controlled laboratory manipulation with unpredictable effects
Measuring behavior at one single moment
Using random assignment to groups

19. What is a key feature of the interview method?
Participants write anonymous responses by email
Behavior is measured through body sensors
Direct verbal communication with the participant
Long-term tracking of development
Statistical comparison of variables in its process

20. What does testing in psychology typically involve?
Measuring behavior over long periods to detect developmental trends
Observing individuals in natural settings without intervention
Administering standardized tasks to assess abilities, traits, or skills
Conducting in-depth interviews to explore subjective experiences
Observing individuals in setting with intervention

21. Which statement correctly distinguishes longitudinal from cross-sectional studies?
Longitudinal and cross-sectional studies usually study one participant’s case
Longitudinal studies rely on experiments; cross-sectional studies rely on observations
Longitudinal studies follow the same participants across a long period; cross-sectional studies compare different age groups at a single point in time
Cross-sectional studies track individuals for years; longitudinal studies measure them only once
Both methods require laboratory conditions to collect reliable data

22. What does a correlational study investigate?
The accuracy of psychological tests across different cultures
Detailed personal history of a single individual
Statistical relationships between two or more variables
Changes in behavior caused by experimental manipulation
Immediate emotional reactions in controlled settings

23. What is motivation?
A method to plan tasks.
The process that initiates, guides, and maintains goal-oriented behaviors.
A technique for managing emotions.
A form of reward system.
A cognitive assessment of outcomes.

24. Which motivation theory suggests that behaviors are motivated by instincts?
Drive Theory
Instinct Theory
Self-Determination Theory
Humanistic Theory
Expectancy Theory

25. What is a key concept of Drive Theory?
People are motivated by their instincts.
People act to reduce internal tension caused by unmet needs.
People aim to achieve self-actualization.
People are motivated by autonomy and competence.
People always act for rewards.

26. What is a limitation of Instinct Theory of Motivation?
It doesn’t explain behaviors, it just describes it.
It doesn’t identify specific instincts.
It overemphasizes social factors.
It ignores physiological needs.
It fails to consider emotional influences.

27. What are the three key elements of Expectancy Theory of Motivation?
Effort, action, and reaction
Valence, instrumentality, and expectancy
Intrinsic, extrinsic, and situational motivation
Autonomy, competence, and relatedness
Emotion, logic, and strategy

28. What does Maslow’s hierarchy of needs represent?
A list of biological drives.
Levels of motivations based on human needs.
Stages of emotional development.
Steps to achieve cognitive growth.
A method for intrinsic motivation.

29. What is an example of extrinsic motivation?
Solving a puzzle for fun
Studying to earn a prize
Reading a book for relaxation
Learning to satisfy curiosity
Exploring new skills for personal growth

30. Which strategy would be the best for motivating others in a team?
Criticize their weaknesses.
Set goals and provide support.
Avoid assigning responsibility.
Devalue their achievements
Focus solely on personal achievements.

31. Which of the following is the correct order of needs in Maslow’s hierarchy from the most basic to the highest?
Self-actualization, Esteem, Love and Belonging, Safety, Physiological
Physiological, Safety, Love and Belonging, Esteem, Self-actualization
Physiological, Love and Belonging, Safety, Esteem, Self-actualization
Safety, Physiological, Love and Belonging, Esteem, Self-actualization
Esteem, Physiological, Safety, Love and Belonging, Self-actualization

32. Which of the following best describes Mihaly Csikszentmihalyi's concept of "flow"?
A state of relaxation achieved through mindfulness and deep breathing.
A state of complete absorption in an activity, where time feels altered, and the task is optimally challenging.
A mindset focused on achieving external rewards and recognition.
A process of multitasking effectively to maximize productivity.
A mental state induced by repetitive physical activity.

33. According to the excitement theory of motivation, what is the explanation people are more motivated to some activities rather to others?
Because they try to balance energy levels through activities of varying intensity
Because their behavior is mainly determined by biological reflexes
Because they try to maintain an optimal personal level of excitement
Because motivation depends only on external rewards and punishments
Because relaxation activities are always more motivating than stimulating ones

34. Which situation is most likely to produce flow according to American psychologist Csikszentmihalyi?
When tasks are either too simple causing boredom, or too difficult causing anxiety
When tasks are extremely easy and relaxing
When challenges match personal skills, creating full focus and enjoyment
When external rewards are the primary motivator
When activities are done without concentration or clear goals

35. According to Self-Determination Theory, which of the following are the three needs which shape internal motivation?
Competence, connection, and autonomy
Achievement, power, and pleasure
Safety, security, and comfort
Recognition, reward, and status
Curiosity, imagination, and creativity

36. Which type of motivation is increased when basic psychological needs are satisfied due to Self Determination Theory?
Intrinsic motivation
Extrinsic motivation
Social motivation
Biological motivation
Random motivation

37. What does self-determination mean in psychology?
The ability to make choices and control one’s own behavior
Acting only under pressure from external rewards or punishments
Following instincts without conscious thought
Relying entirely on others to make decisions
Randomly choosing actions without purpose

38. What does self-actualization refer to in psychology?
Achieving material success, social recognition
Acting without goals or planning
Fully realizing personal potential by developing talents
Following others’ directions in every decision
Avoiding challenges and staying within comfort zones

39. What is an example of intrinsic motivation?
Solving a puzzle for personal enjoyment
Studying to earn a prize
Participating in a contest for a trophy
Working to receive a salary
Completing tasks to gain social recognition

40. What is the main difference between intrinsic and extrinsic motivation?
Intrinsic comes from personal satisfaction; extrinsic is from external rewards
Intrinsic depends on social approval; extrinsic on personal interest
Intrinsic is always stronger than extrinsic
Extrinsic comes from habits; intrinsic comes from instincts
Extrinsic never involves rewards

41. What does cognitive psychology study?
Physiological processes in the body.
The interaction of human thinking, emotions, creativity, language, and problem-solving.
Genetic inheritance and human evolution.
Animal behavior in natural environments.
The influence of society on individual behavior.

42. What is an example of a cognitive process?
Breathing and blood circulation.
Recognizing environmental stimuli and solving problems.
Distributing energy in the body.
Regulating body temperature.
Producing hormones.

43. What is the difference between hot and cold cognition?
Hot cognition is linked to recognizing, while cold cognition relates to language.
Hot cognition includes emotions, while cold cognition does not involve emotions.
Hot cognition works only during sleep, while cold cognition works during wakefulness.
Hot cognition is related to genes, while cold cognition is related to culture.
Hot cognition happens in stress, while cold cognition happens in normal situations.

44. Which of the following is NOT a cognitive process?
Perception.
Breathing.
Memory.
Learning.
Decision-making.

45. What does the "g-factor" concept by Charles Spearman mean?
The ability to develop knowledge in one area only.
General cognitive ability that affects performance on different cognitive tests.
Skill specifically in math-related tasks.
A group of social factors that influence intelligence.
The ability to adapt to physical challenges.

46. Which of the following is one of the eight types of intelligence proposed by Howard Gardner?
Fluid Intelligence
Financial Intelligence
Visual-Spatial Intelligence
Creative Intelligence
Technological Intelligence

47. What is the ability to recognize emotions in oneself and others called in the context of Emotional Intelligence?
Use emotions
Perceive emotions
Manage emotions
Control emotions
Express emotions

48. According to Cattell’s theory, which of the following best describes fluid intelligence?
The ability to use accumulated knowledge and experience.
The ability to learn new things fast and abstractly
The ability to recall facts and general information quickly.
The ability to communicate effectively in social situations.
The ability to rely on the intelligence and experience of others.

49. What does the gambler’s fallacy refer to?
The belief that a person can control random outcomes because he is just lucky.
The belief that past events affect the probability of future events in a way that contradicts the laws of probability.
The assumption that winning streaks are more likely to continue indefinitely.
The tendency to bet larger amounts after a series of losses.
The belief that luck always balances out in the long run.

50. One of the cognitive biases:
Attraction
Framing effect
Decision making
Hot cognition
Cold cognition

51. How do smart people see their mistakes?
They ignore them.
They feel bad and give up.
They try not to make mistakes by avoiding risks.
They use mistakes as chances to learn and improve.
They blame others for them.

52. What is the difference between fluid intelligence and crystallized intelligence?
Fluid intelligence is about creativity, and crystallized intelligence is about logic.
Crystallized intelligence is something you're born with, but fluid intelligence is something you learn.
Fluid intelligence is about memorizing, and crystallized intelligence is about solving puzzles.
Fluid intelligence helps solve new problems, while crystallized intelligence is what you know from past learning.
There is no difference.

53. Why are curious people often seen as smart?
They always agree with others.
They never ask questions to avoid looking unsure.
They only focus on finding what’s wrong.
They ask questions and try to learn about new ideas and possibilities.
They stick to things they already understand.

54. Why do smart people sometimes wait to finish tasks?
They don’t care about deadlines.
They work better when under pressure.
They are bad at managing their time.
They use the time to think of better ideas or solutions.
They forget to do the work.

55. What is «metacognition»?
The ability to process information at a faster rate than others.
The ability to think about how are you thinking
The ability to memorize large amounts of information quickly.
The ability to understand emotions and manage stress effectively.
The ability to perform tasks without making mistakes.

56. What does perception allow us to do?
Make logical decisions
Interpret and understand sensory information
Remember past events
Solve complex problems
Focus on one task at a time

57. What is the function of attention in cognition?
To store information for future use
To focus awareness on specific stimuli
To recall information from memory
To interpret sensory data
To create new concepts

58. Which of the following is an example of a real cognitive bias?
Problem-solving bias
Memory recall bias
Confirmation bias
Reasoning bias
Learning new information bias

59. Which cognitive bias involves making judgments based on the first piece of information encountered?
Availability bias
Self-serving bias
Confirmation bias
Anchoring bias
Bandwagon effect

60. What is the definition of stress in psychology?
A purely physical reaction
A feeling of strain and pressure
A state of euphoria and relaxation
The absence of challenges
A feeling of losing hope

61. What is "eustress"?
Negative stress causing harm
Positive stress that motivates and challenges
Chronic stress leading to fatigue
A complete absence of stress
None of the above

62. Which is NOT an instinctive stress response due to 4F theory?
Fight
Flight
Fawn
Freeze
Flow

63. Which of the following is an example of natural self-regulation?
Autogenic training
Breathing techniques
Interacting with nature
Guided meditation
Cognitive restructuring

64. What helps reduce stress factors effectively?
Focusing on uncontrollable factors
Ignoring stressors
Understanding what is under your control
Avoiding self-reflection
Multitasking

65. What is the primary goal of regular stress management practices?
Avoiding all forms of stress
Suppressing emotional responses
Understanding and managing stressors effectively
Increasing stress hormones like cortisol
Multitasking to reduce stress

66. What does self-approval involve?
Seeking validation from others
Ignoring personal achievements
Affirming positive thoughts about oneself
Avoiding self-reflection entirely
Criticizing one’s outcomes

67. What is an emotion in psychology?
A subjective response accompanied by physiological changes and often linked to behavioral changes
A long-lasting general feeling unrelated to specific events
A purely cognitive and rational evaluation of a situation without bodily response
A physical sensation without any psychological component
A random thought that has no effect on behavior

68. Which of the following are considered basic emotions?
Happiness, sadness, fear, anger, disgust
Motivation, curiosity, boredom, excitement
Relaxation, stress, anxiety, flow
Love, ambition, pride, jealousy
Hunger, thirst, pain, pleasure

69. What are primary emotions?
Immediate emotional reactions to a situation
Emotions learned through social experience
Feelings caused by physical sensations only
Emotions that appear after long reflection
Emotions that are always negative

70. What is emotional intelligence (EI)?
The ability to recognize, understand, and manage one’s own and others’ emotions
The capacity to memorize facts and solve mathematical problems
A skill to act without considering feelings of others
The tendency to avoid emotional situations
The ability to control others’ emotions

71. Which of the following are core components of emotional intelligence?
Self-awareness, self-regulation, motivation, empathy, social skills
Motivation, empathy, attention, perception, reasoning
Strength, speed, self-awareness, endurance, flexibility
Empathy, social skills creativity, problem-solving, motivation
Self-regulation, motivation, reflection, imitation, repetition

72. Who is credited with developing the first typology of temperaments in ancient times?
Hippocrates
Aristotle
Immanuel Kant
Ivan Pavlov
Claudius Galen

73. According to Ivan Pavlov, what are the three innate properties of the nervous system that define temperament?
Speed, focus, and energy
Strength, flexibility, and determination
Mobility, agility, and attention
Reaction time, patience, and balance
Strength, mobility, and balance

74. Which temperament thrives on leadership and immediate action?
Phlegmatic
Melancholic
Sanguine
None of them
Choleric

75. What does the term "temperament" primarily refer to in psychology?
A learned set of personality traits
The social environment of an individual
A person's education level
Cultural norms
Innate, biologically-based behavioral tendencies

76. Which philosopher divided temperaments into 'temperaments of feeling' and 'temperaments of activity'?
Aristotle
Friedrich Nietzsche
Socrates
Descartes
Immanuel Kant

77. Which temperament is described as being calm, analytical, and systematic in problem-solving?
Sanguine
Choleric
Melancholic
Unpredictable
Phlegmatic

78. What type of temperament is most likely to quickly adapt to new plans or circumstances?
Phlegmatic
Melancholic
Choleric
Inflexible
Sanguine

79. What is the primary distinction between temperament and character?
Temperament changes significantly, while character is static.
Temperament is based on socialization, while character is innate.
Temperament involves core values, while character does not.
Temperament develops through life experience, while character does not.
Temperament is biological, while character is shaped by life experiences.

80. Which temperament needs structure and emotional support to thrive?
Sanguine
Phlegmatic
Choleric
Unpredictable
Melancholic

81. Which of the following best defines personality?
A set of physical characteristics that make a person unique
The characteristic patterns of thoughts, feelings, and behaviors that make a person unique
A person's social media presence and public image
The sum of a person's professional achievements
A collection of temporary emotional states

82. In Freud's theory of personality, which component operates on the "pleasure principle"?
Ego
Superego
Id
Shadow
Persona

83. In Freud's theory of personality, which component operates on the "principle of morality"?
Ego
Superego
Id
Anima
Animus

84. In Freud's theory of personality, which component operates on the "reality principle"?
Ego
Superego
Id
Anima
Shadow

85. What is the main function of Jung's "Persona" archetype?
It represents our animal instincts
It is the outward face we present to the world
It connects us to our unconscious mind
It represents our true self
none of the above

86. What does Jung's "Shadow" archetype primarily represent?
The social roles we play
The hidden, repressed aspects of our psyche
The creative, intuitive part of our mind
The collective unconscious
None of the above

87. Which of the following best reflects the relationship between the "Shadow" and the "Persona" in Jung’s theory?
They are identical in function
They are opposites that complement each other
They are both repressed aspects of the psyche
The Persona directly replaces the Shadow
None of the above

88. In Eric Berne's Transactional Analysis, which personality state is characterized by logic, reasoning, and analyzing situations?
Parent
Child
Adult
Superego
Shadow

89. What does the "Parent" state in Berne's Transactional Analysis primarily reflect?
Spontaneous feelings and impulses
Learned rules, values, and behaviors
Logical reasoning and problem-solving
Subconscious desires
None of the above

90. Which of the following best describes the "Child" state due to Berne's Theory?
It regulates emotions logically
It fully replaces the "Parent" state
It expresses creativity, emotions, and spontaneity
It analyzes and processes information
None of the above

91. Which personality state in Berne’s theory is best suited for solving problems in an objective manner?
Parent
Child
Adult
Shadow
Superego

92. Which of the Big Five personality traits is associated with being organized, responsible, and goal directed?
Openness
Extraversion
Agreeableness
Conscientiousness
Neuroticism

93. Which of the Big Five personality traits reflects a tendency to experience emotions such as anxiety, anger, and sadness?
Extraversion
Neuroticism
Openness
Agreeableness
Conscientiousness

94. Which Big Five trait is linked to being imaginative, curious, and open to new experiences?
Agreeableness
Extraversion
Conscientiousness
Openness
Neuroticism

95. What does the "Extraversion" trait in the Big Five describe?
A preference for solitude and reflection
A tendency to seek social interaction and energy from others
A focus on organization and planning
A disposition towards anxiety and moodiness
A concern for others' well-being

96. Which of the Big Five traits is characterized by trust, kindness, and a cooperative nature?
Conscientiousness
Openness
Agreeableness
Extraversion
Neuroticism

97. What is self-concept?
The way others perceive you
Your physical appearance
Your answer to the question "Who am I?"
Your professional achievements
Your social status

98. Which personality type in Jung's theory represents the unconscious feminine side in males and masculine tendencies in women?
Shadow
Persona
Self
Anima/Animus
Ego

99. What is personal development?
A random process of improving life.
A single event that transforms a person.
A deliberate effort to improve life.
Attending personal growth courses.
Lifelong self-education without specific goals.

100. Which statement about self-awareness is correct?
Self-awareness helps avoid mistakes.
It is the analysis of other people’s actions.
It includes understanding emotions, thoughts, and behaviors.
It is unnecessary for personal growth.
Self-awareness is limited to analyzing past experiences.

101. Which techniques will help to develop self-awareness the best way?
Playing games and having fun.
Journaling and meditation.
Watching movies about fiction heroes.
Constantly working on projects.
Spontaneous conversations and small-talks.

102. What are the benefits of increased self-awareness?
Better emotional regulation and decision-making.
Faster learning of technical skills.
The ability to avoid all negative emotions.
Complete elimination of personal weaknesses.
Greater reliance on others for decisions.

103. How can a growth mindset influence personal development?
By encouraging a focus on innate talent over effort.
By promoting resilience and learning from setbacks.
By avoiding challenges to prevent failure.
By believing abilities cannot be improved.
By eliminating the need for continuous learning.

104. What is a characteristic of a fixed mindset?
Viewing failure as an opportunity to grow.
Believing abilities are too hard to change.
Embracing challenges and persisting through setbacks.
Rewarding effort and learning from mistakes.
Viewing effort as a pathway to mastery.

105. Which technique helps time management?
Working without breaks to maximize productivity.
The Pomodoro Technique and time-blocking.
Avoiding task prioritization.
Focusing on multiple tasks at once.
Procrastinating with the hope problems will just go away.

106. What does prioritization in time management involve?
Ignoring important tasks to focus on urgent ones.
Using tools like the Eisenhower Matrix to identify key tasks.
Completing all tasks simultaneously.
Avoiding setting boundaries to save time.
Spending equal time on every activity.

107. What is one way to overcome imposter syndrome?
Avoid challenging tasks to feel secure.
Focus on recognizing your efforts and contributions.
Assume your success is due to external factors.
Avoid feedback and constructive criticism.
Stop acknowledging your achievements.

108. What is intrinsic motivation?
Motivation driven by external rewards.
Motivation that comes from within, like a passion for a task.
Motivation that depends on peer approval.
Motivation based on competition with others.
Motivation that fades without external pressure.

109. What is a benefit of identifying personal values?
Making random choices based on circumstances.
Aligning goals with what is meaningful to you.
Focusing solely on extrinsic rewards.
Ignoring intrinsic motivation in decision-making.
Relying on others to define your priorities.

110. Which example demonstrates a growth mindset?
Giving up when faced with difficulty.
Viewing challenges as opportunities to improve.
Believing you cannot develop new skills.
Avoiding mistakes by not taking risks.
Sticking only to what you already know.

111. Which of the following best defines assertive behavior?
Dominating others to ensure your needs are met, even at their expense.
Avoiding conflict by prioritizing the needs of others over your own.
Expressing your thoughts, feelings, and needs honestly and respectfully while respecting others' rights.
Ignoring others’ opinions and focusing solely on your own perspective.
Remaining silent to avoid expressing disagreement or dissatisfaction.

112. What is the “Halo Effect”?
Overgeneralizing based on one positive trait
Judging based on stereotypes
Projecting your emotions onto others
Focusing on first impressions
Avoiding non-verbal cues

113. What do crossed arms during a conversation often indicate?
Confidence
Disagreement
Politeness
Happiness
Attractiveness
`;

const PSYCHOLOGY_ANSWER_KEY: Record<number, number> = {
  1: 3, 2: 1, 3: 1, 4: 2, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1, 10: 0,
  11: 2, 12: 1, 13: 1, 14: 2, 15: 1, 16: 4, 17: 1, 18: 1, 19: 2, 20: 2,
  21: 2, 22: 2, 23: 1, 24: 1, 25: 1, 26: 0, 27: 1, 28: 1, 29: 1, 30: 1,
  31: 2, 32: 1, 33: 2, 34: 2, 35: 0, 36: 0, 37: 0, 38: 2, 39: 0, 40: 0,
  41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 2, 47: 1, 48: 1, 49: 1, 50: 1,
  51: 3, 52: 3, 53: 3, 54: 3, 55: 1, 56: 1, 57: 1, 58: 2, 59: 3, 60: 1,
  61: 1, 62: 4, 63: 2, 64: 2, 65: 2, 66: 2, 67: 0, 68: 0, 69: 0, 70: 0,
  71: 0, 72: 4, 73: 4, 74: 4, 75: 4, 76: 4, 77: 4, 78: 4, 79: 4, 80: 4,
  81: 1, 82: 2, 83: 1, 84: 0, 85: 1, 86: 1, 87: 1, 88: 2, 89: 1, 90: 2,
  91: 2, 92: 3, 93: 1, 94: 3, 95: 1, 96: 2, 97: 2, 98: 3, 99: 2, 100: 2,
  101: 1, 102: 0, 103: 1, 104: 1, 105: 1, 106: 1, 107: 1, 108: 1, 109: 1, 110: 1,
  111: 2, 112: 0, 113: 1
};


// ==========================================
// EXPORTS
// ==========================================

export const QUESTIONS_PHILOSOPHY = parseQuestions(PHILOSOPHY_RAW_DATA, PHILOSOPHY_ANSWER_KEY);
export const QUESTIONS_PSYCHOLOGY = parseQuestions(PSYCHOLOGY_RAW_DATA, PSYCHOLOGY_ANSWER_KEY);
