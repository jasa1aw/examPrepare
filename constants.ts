
import { Question } from './types'

// ==========================================
// PARSING LOGIC
// ==========================================

const parseQuestions = (rawData: string, answerKey?: Record<number, number>): Question[] => {
  // 1. Split by "number dot" pattern (e.g., "1.", "105.")
  // We use a regex lookahead to split but keep the delimiter or just split and reconstruct
  // Regex: Split by newline followed by number and dot
  const chunks = rawData.split(/\n(?=\d+\.)/)

  const questions: Question[] = []

  chunks.forEach((chunk) => {
    // Clean up whitespace
    const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l)
    if (lines.length < 2) return

    // First line is the question text
    // Remove the leading number and dot (e.g. "1. <question>Text" or "1. Text")
    let questionText = lines[0].replace(/^\d+\.\s*/, '').trim()

    // Remove <question> tag if present (legacy format)
    questionText = questionText.replace('<question>', '').trim()

    // The rest are options
    // Filter out lines that might be "Ответ:" (Answer keys in raw text) or empty
    let options = lines.slice(1).filter(line => !line.toLowerCase().startsWith('ответ:'))

    // If options contain labels like "a)", "b)", remove them for cleaner UI
    options = options.map(opt => opt.replace(/^[a-z]\)\s*/i, '').replace(/^\d+\.\s*/, ''))

    if (options.length > 0) {
      // Extract ID from the first line for mapping
      const idMatch = lines[0].match(/^(\d+)\./)
      const id = idMatch ? parseInt(idMatch[1]) : questions.length + 1

      const q: Question = {
        id: id,
        text: questionText,
        options: options,
      }

      // Assign correct answer if key exists
      if (answerKey && answerKey[id] !== undefined) {
        // Ensure index is within bounds
        if (answerKey[id] < options.length) {
          q.correctAnswerIndex = answerKey[id]
        }
      }

      questions.push(q)
    }
  })

  return questions
}


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
`

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
}


const PSYCHOLOGY_RAW_DATA = `
1. <question>________ focuses on the role of different parts of brain in regulating feelings, memories, emotions and other aspects of behaviour.
Cognitive approach
Humanistic approach
Biological approach
Psychoanalytic approach

2. <question>Focus of the ________ is on the information processing capacity of the individual.
Cognitive approach
Biological approach
Humanistic approach
Psychoanalytic approach

3. <question>________ assumes that the person is active and self-actualizing agent and has a choice in deciding his behavior.
Psychoanalytic approach
Humanistic approach
Biological approach
Cognitive approach

4. <question>According to the ________ majority of human behaviours are triggered by unconscious motivation.
Psychoanalytic approach
Humanistic approach
Behaviouristic approach
Cognitive approach

5. <question>The unit of analysis for the ________ is explicit, objective and overt behaviour and its relationship with environmental stimulation
Behaviouristic approach
Humanistic approach
Psychoanalytic approach
Cognitive approach

6. <question>Observation is divided into ________ and ________ observation depending on the role of observer.
Participant, non-participant
Manipulating, controlling
Individual
Group

7. <question>In an experiment the experimenter studies the effect of one variable on the other by deliberately ________ and ________ one variable.
Participant, non-participant
Manipulating, controlling
Manipulating, Manipulating
All answer are correct

8. <question>In the case study method the main unit of analysis is the ________ and his experiences across different contexts in life.
Individual
Group/ Individual people
group people
All answer are correct

9. <question>The variable which is controlled and manipulated by the experimenter is called ________ variable and the variable on which its impact is studied is known as ________ variable.
Independent, dependent
Independent, Independent
Dependent, dependent
All answer are correct

10. <question>————————— method is generally used to study the pattern of opinions, attitudes, beliefs and values of the people.
Survey
test
Interview
All answer are correct

11. <question>A ————————— ——————— provides an objective assessment of different qualities and limitations of the individual.
Psychological test
Interview
Survey
All answer are correct

12. <question>————————————— of a test refers to its consistency in terms yielding the scores from the representative sample for which it has been designed.
Reliability
Psychological test
Validity
All answer are correct

13. <question>—————————— of a test reveals the extent to which the test measures what it claims to measure.
Validity
Psychological test
Reliability
All answer are correct

14. <question>A ———————— —————— uses ambiguous, vague and unstructured stimuli such as pictures, inkblots, drawings, incomplete sentences.
Psychological test
Projective test
Interview
All answer are correct

15. <question>The items (questions) of the questionnaire can be either in ———————— ———— —— form or in —————————- form.
Continuously, brief
repeated questions, different questions
Close-ended, open-ended
All answer are correct

16. <question>Interview as one of the techniques of data collection is often referred as a —— ———————— ———————— between two persons with a set objective.
Face –to-face interactionGfdgdf
Structured interview
Unstructured interview
All answer are correct

17. <question>In the case of ———————————— —————————— the questions are already framed with the possible option
All answer are correct
Structured interview
Face –to-face interaction
Unstructured interview

18. <question>——————————— ————————————— comprises of a variety of open-ended questions and the interviewee gives his or her responses as
Unstructured interview
freely as possible.
Face –to-face interaction
Structured interview

19. <question>The process by which a person moves towards fulfilment of wants is called:
motivation
need
incentive
goal

20. <question>Secondary needs are acquired through
social interaction
biological needs
intrinsic procession
innate needs

21. <question>According to Maslow the most basic needs are:
love
biological
safety
cognitive

22. <question>Reema gets Rs. 20 for every good grade she obtains in school. Reema is receiving:
extrinsic motivation
intrinsic motivation
primary need
growth need

23. <question>Ashok has a high need for …………….. because he likes to study and investigate new things.
love
nurturance
achievement
exploration

24. <question>Who developed the personality theories of social cognitive that included observational learning, self-efficacy, situational influences, and cognitive processes?
Albert Bandura
Abraham Maslow
Sigmund Freud
Erik Erikson

25. <question>The psychoanalytic perspective of personality emphasizes the importance of
situational influences
cognitive processes
observational learning, self-efficacy
early childhood experiences and the unconscious mind

26. <question>Who was the first to introduce the concepts of introversion and extroversion
Carl Jung
Erik Erikson
Alfred Adler
Karen Horney

27. <question>The theory Attitudes Versus Actions: LaPiere's (1934) Classic Study suggested that
attitudes correlate with behaviors.
Attitudes correlate with behaviors depending on the situation
All answers are correct
attitudes did not correlate with behaviors.

28. <question>What is correct about temperament.
It is the character of a person depending on the social environment
are human behaviors depending on the situation
It is considered to have a biological basis
all answers are correct

29. <question>Sensation and perception are closely related processes. Which is affected by a person's culture and experiences?
both sensation and perception
only perception
neither sensation nor perception
only sensation

30. <question>What are values?
Ideas, thoughts, and actions that are important to us
An object that we like
Strange thoughts
Something that we enjoy doing

31. <question>What is a moral value?
set of principles guiding us to evaluate what is right or wrong
if it is important for acquiring something else
None of these
A value that shows you how to do something

32. <question>What is a Social Norm?
System of rules created and enforced through social or governmental institutions to regulate behavior
Are the unwritten rules of behavior that are considered acceptable in a group or society
these are the rights and obligations of people
All answers are correct

33. <question>What is Thinking?
Thinking is the mental activity that allows us to understand
All answers are correct
Thinking is the mental activity that allows us to understand, process, and communicate information.
The process of considering or reasoning about something.

34. <question>Basic Elements of Thinking
analysis, synthesis, generalization.
knowledge, comprehension, application.
symbols, concepts, and prototypes.
all answers are correct

35. <question>The process of interaction with people and the environment is …
All of answer is correct
Conversation
Communication
interaction

36. <question>The most commonly employed tool of communication is …
Language
Emotion
Act
All answer is correct

37. <question>Anything that interferes with the sender's creating and delivering a message and the receiver interpreting the message is called__
distortion
distraction
netiquette
communication

38. <question>Communication is always a ___ way process.
Two
one
three
four

39. <question>This type of communication is speaking to teachers and students.
oral
written
non verbal
body language

40. <question>This type of communication includes sending emails, typing reports and letters.
written
oral
verbal
non verbal

41. <question>Delivering a message by means other than speaking or writing is called ___________ communication.
Verbal
non verbal
written
oral

42. <question>Can a person's perception be a barrier to communication
Yes
No
Depending on the situation
All of answer is correct

43. <question>Who created the Linear Models of communication?
R. West, L. Turner
K. Thomas, R.Kilmann
K. Shannon, W. Weaver
All of answer is correct

44. <question>In which model of communication, the sender is the source of the message and does not wait the feedback from receiver.
Interactional Models of Communication
Transactional Models of Communication
Linear Models of Communication
All of answer is correct

45. <question>The author of the theory conflict resolution strategies that people use to handle conflict, including avoiding, defeating, compromising, accommodating, and collaborating.
K. Shannon, W. Weaver
R. West, L. Turner
K. Thomas, R.Kilmann
All of answer is correct

46. <question>According Louis R. Pondy research there are the five stages of a conflict episode are identified:
Latent Phase, perceived Phase, differentiation Phase, Initiation Phase, Resolution Phase.
Prelude to conflict, Triggering Event, felt conflict Event, manifest conflict, and conflict aftermath or conditions.
latent conflict (conditions), perceived conflict (cognition), felt conflict (affect), manifest conflict (behavior), and conflict aftermath (conditions).
Triggering Event, felt conflict Event, manifest conflict, and conflict aftermath or conditions.

47. <question>A stressor is...
Any person, object, situation or event that produces stress.
a state of physiological and psychological arousal.
a psychological factor that always originates from the individual
an external factor that originates from the environment

48. <question>What does adrenaline do to the body during the alarm stage?
calms the body down
makes a person tired
makes you feel good
triggers the fight/flight response

49. <question>Rio has broken up with his girlfriend. He is feeling very stressed about suddenly becoming single and the end of their relationship. A physical sign of stress that Rio might exhibit is:
headaches
denial
panic
sleep disturbances

50. <question>What part of the nervous system is activated by stress?
sympathetic
parasympathetic
somatic
central

51. <question>Stress has been shown to put people at a higher risk for
unplanned pregnancy
schizophrenia
Alzheimer's
heart attack and stroke

52. <question>Which of these might cause stress?
All answers are correct
Planning a wedding
Traveling for vacation
Driving during rush hour

53. <question>The "stress response" prepares your body to:
Fight or run
Sleep
Eat more
All answers are correct

54. <question>Chronic stress affects sexual health in:
Both
All answers are correct
Man
Women

55. <question>———————— ——————— focuses on the role of different parts of brain in regulating feelings, memories, emotions and other aspects of behaviour.
Cognitive approach
Humanistic approach
Psychoanalytic approach
Biological approach /neuropsychological approach

56. <question>Which psychological approach emphasizes the study of mental processes such as perception and memory?
Cognitive approach
Humanistic approach
Psychoanalytic approach
Biological approach

57. <question>———————————— ————————— assumes that the person is active and self-actualizing agent and has a choice in deciding his behavior.
Humanistic approach
Psychoanalytic approach
Biological approach
Cognitive approach

58. <question>Who developed the theory of psychoanalysis?
Ivan Pavlov
Albert Bandura
Carl Jung
Sigmund Freud

59. <question>Observation is divided into ————————— and ————————— ——— observation depending on the role of observer.
Participant, non-participant
Controlled, uncontrolled
Structured, unstructured
Overt, covert

60. <question>In which year was the first psychological laboratory established by Wilhelm Wundt?
1900
1950
2000
1879

61. <question>What is the main unit of analysis in the case study method?
Individual and his experiences across different contexts in life
Group of individuals
Statistical data
Community dynamics

62. <question>————————— method is generally used to study the pattern of opinions, attitudes, beliefs and values of the people.
Survey
Interview
Test
All answer are correct

63. <question>Which of the following individuals is considered the father of modern psychology?
B.F. Skinner
Sigmund Freud
Carl Rogers
Wilhelm Wundt

64. <question>Who conducted the Little Albert experiment?
Carl Rogers
John B. Watson
Sigmund Freud
B.F. Skinner

65. <question>The items (questions) of the questionnaire can be either in ———————— ———— —— form or in —————————- form.
open ended; close ended
personal essay; structured
descriptive; numerical
analytical; intuitive

66. <question>Interview as one of the techniques of data collection is often referred as a ————— ———— ————————— ————————— between two persons with a set objective.
written formal conversation
Face –to-face interaction
spontaneous emotional reaction
casual social meeting

67. <question>Structured interview is characterized by:
Unplanned and spontaneous questions
Flexible and changing structure
Pre-determined questions in a fixed order
Use of storytelling techniques

68. <question>What was the main goal of the Little Albert experiment?
To study moral development in children
To examine memory capacity in infants
To demonstrate classical conditioning in humans
To analyze attachment between mother and child

69. <question>The process by which a person moves towards fulfillment of wants is called:
Motivation
Adaptation
Learning
Conditioning

70. <question>According to Maslow, the most basic needs are:
Safety
Biological
Socialization and love
Esteem and self-actualization

71. <question>Who developed the personality theories of social cognitive that included observational learning, self-efficacy, situational influences, and cognitive processes?
Sigmund Freud
Carl Rogers
Albert Bandura
B.F. Skinner

72. <question>The psychoanalytic perspective of personality emphasizes the importance of
situational influences.
early childhood experiences and the unconscious mind
observational learning, self-efficacy.
cognitive processes

73. <question>Who was the first to introduce the concepts of introversion and extroversion?
Sigmund Freud
Carl Jung
Alfred Adler
Erik Erikson

74. <question>What was the main finding of the learned helplessness experiment?
Animals prefer social environments.
Animals can develop new skills quickly.
Animals can become passive when they feel they have no control
Animals can learn to escape from stress

75. <question>What is the primary focus of communication theory in psychology?
Analyzing how information is transmitted and received
Understanding how people learn.
Exploring emotions.
Studying brain functions

76. <question>What is important for successful communication?
Ignoring non-verbal signals.
High speed of information transmission.
Understanding the message
Using complex words

77. <question>The most commonly employed tool of communication is:
Emotion
Act
Language
Non-verbal cues

78. <question>Communication is always a ___ way process.
One
Two
Multi
Unidirectional

79. <question>What is non-verbal communication primarily concerned with?
The use of words and language
Body language and facial expressions
Written communication in formal settings
The role of speech in social interaction

80. <question>What does psychology study?
Mental processes and behavior of individuals and groups
Only brain anatomy and physiology
Patterns of social interaction only
Emotional responses in animals only

81. <question>Which research method involves systematic observation of behavior in natural conditions without influencing it?
Laboratory experiment
Psychological testing
Case study
Naturalistic observation

82. <question>Which psychological approach studies only observable behavior?
Psychoanalytic
Behaviorist
Humanistic
Cognitive

83. <question>Which approach focuses on unconscious processes?
Cognitive
Psychoanalytic
Behaviorist
Humanistic

84. <question>Which approach views a person as striving for self-actualization?
Humanistic
Behaviorist
Biological
Cognitive

85. <question>Which approach studies thinking, memory, and attention?
Cognitive
Psychoanalytic
Humanistic
Behaviorist

86. <question>Which approach focuses on a person's inner experience and feelings?
Behavioral
Humanistic
Cognitive
Biological

87. <question>Who is most closely associated with psychoanalysis?
Carl Rogers
Sigmund Freud
Ivan Pavlov
Jean Piaget

88. <question>Who is one of the founders of behaviorism?
Ivan Pavlov
Carl Jung
Abraham Maslow
Jean Piaget

89. <question>Which author is associated with the humanistic approach?
Sigmund Freud
Carl Rogers
John Watson
Jean Piaget

90. <question>Which scientist is most often associated with the cognitive approach?
Jean Piaget
Sigmund Freud
Ivan Pavlov
Carl Rogers

91. <question>Which approach aims to change a person's thoughts and beliefs?
Cognitive
Biological
Psychoanalytic
Humanistic
`

const PSYCHOLOGY_ANSWER_KEY: Record<number, number> = {
  1: 2, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0, 7: 1, 8: 0, 9: 0, 10: 0,
  11: 0, 12: 0, 13: 0, 14: 1, 15: 2, 16: 0, 17: 1, 18: 0, 19: 0, 20: 0,
  21: 1, 22: 0, 23: 3, 24: 0, 25: 3, 26: 0, 27: 3, 28: 2, 29: 1, 30: 0,
  31: 0, 32: 1, 33: 1, 34: 2, 35: 0, 36: 0, 37: 3, 38: 0, 39: 0, 40: 0,
  41: 0, 42: 0, 43: 2, 44: 2, 45: 2, 46: 2, 47: 0, 48: 3, 49: 0, 50: 0,
  51: 3, 52: 0, 53: 0, 54: 0, 55: 3, 56: 0, 57: 0, 58: 3, 59: 0, 60: 3,
  61: 0, 62: 0, 63: 3, 64: 1, 65: 0, 66: 1, 67: 2, 68: 2, 69: 0, 70: 1,
  71: 2, 72: 1, 73: 1, 74: 2, 75: 0, 76: 2, 77: 2, 78: 1, 79: 1, 80: 0,
  81: 3, 82: 1, 83: 1, 84: 0, 85: 0, 86: 1, 87: 1, 88: 0, 89: 1, 90: 0,
  91: 0
}
// ==========================================
// CULTUROLOGY DATA
// ==========================================

const CULTUROLOGY_RAW_DATA = `
1.	The term "hegemony," as used in Cultural Studies to describe the dominant cultural norms and values that maintain social control, was originally developed by which thinker?
A) Karl Marx
B) Theodor Adorno
C) Antonio Gramsci
D) Jean Baudrillard
E) Clifford Geertz

2.	What is the main focus of cultural relativism in Cultural Studies?
A) The belief that some cultures are more advanced than others
B) That all cultural practices should be judged by universal moral standards
C) That each culture must be understood in its own terms without ethnocentric judgment
D) The classification of cultures according to religious traditions
E) That culture is determined solely by economic systems

3.	What role does media play in Cultural Studies?
A) It is considered a neutral transmitter of factual information
B) It is ignored in favor of traditional cultural expressions
C) It is analyzed as a powerful tool that shapes ideology, identity, and cultural norms
D) It is studied mainly for its technological innovations
E) It is valued only for its entertainment function

4.	Which of the following best defines culture in the context of Cultural Studies?
A) The study of biology and human evolution
B) The collection of economic systems in a society
C) The shared beliefs, values, customs, behaviors, and artifacts of a group
D) The formal political structure of a society
E) A static and unchanging tradition passed through generations

5.	Akhmet Baitursynov is primarily known for:
A) Writing romantic poetry
B) Leading the Red Army
C) Creating the Kazakh alphabet reform and linguistic studies
D) Organizing musical festivals
E) Translating Chinese classics

6.	Who is considered the father of American cultural anthropology?
A) Clifford Geertz
B) Bronisław Malinowski
C) Lewis Henry Morgan
D) Michel Foucault
E) Franz Boas

7.	The philosophy of "Homo Ludens" by Johan Huizinga emphasizes:
A) War as the foundation of culture
B) Logic as the main human function
C) Play as the basis of culture and civilization
D) Economy as the root of culture
E) Politics as the highest cultural form

8.	What is the difference between material and non-material culture?
A) One is old, one is new
B) One is correct, one is wrong
C) One includes physical objects, the other includes beliefs and values
D) Both are the same
E) One is superior to the other

9.	Which term is associated with Margaret Mead's studies of adolescence in Samoan society?
A) Cultural conflict
B) Cultural relativism
C) Ethnocentrism
D) Technological determinism
E) Power dynamics

10.	Which concept describes the coexistence of diverse cultures in one society?
A) Nationalism
B) Multiculturalism
C) Cultural purity
D) Ethnocentrism
E) Colonialism

11.	Researchers believe that an individual's norms and actions should be understood by others in terms of that individual's own cultural context. This concept is referred to as:
A) Cultural interpretation
B) Cultural sensitivity
C) Cultural relativism
D) Cultural boundaries
E) Cultural aspect

12.	An exchange student travels to Morocco to learn local language and culture. The first month he was there, he spent a lot of time at local bazaars where he learned about Moroccan "material culture". Which of the following is not an example of material culture?
A) Traditions
B) Vases
C) Artifacts
D) Souvenirs
E) Necklaces

13.	Proper gestures and body language are important during business interactions. When conducting business with other cultures, how should we understand gestures (such as shaking your head)?
A) Gestures are understood by people and animals in the same way
B) Gestures are interpreted in the same way by all cultures
C) Gestures are not needed
D) Gestures are defined uniquely by each culture
E) Gestures are universal

14.	Samat travels to a new country. While in line at the train station, other people stand very close to him closer than in his country. He immediately feels anxious and uncomfortable. The disorientation a person may feel when experiencing an unfamiliar way of life changes in social environments is referred to as:
A) Culture shock
B) Culture clash
C) Cultural independency
D) Cultural sickness
E) Cultural dependency

15.	The philosophy of "Homo Ludens" by Johan Huizinga emphasizes:
A) War as the foundation of culture
B) Logic as the main human function
C) Play as the basis of culture and civilization
D) Economy as the root of culture
E) Politics as the highest cultural form

16.	What is Al-Farabi best known for in the history of philosophy?
A) Discovering algebra
B) Founding political theory
C) Synthesizing Greek philosophy with Islamic thought
D) Writing only in poetry
E) Inventing the printing press

17.	What is the title of Al-Farabi's most famous political work?
A) The Republic
B) The Book of Justice
C) The Virtuous City (al-Madina al-Fadila)
D) The Path to Wisdom
E) The Perfect Soul

18.	Which of the following is a prominent symbol of modern Kazakh national identity?
A) Yurt
B) Golden Man (Altyn Adam)
C) Silk
D) Tundra
E) Dombyra

19.	What is the traditional Kazakh string instrument often used in contemporary performances?
A) Komuz
B) Kyl-kobyz
C) Dombyra
D) Balalaika
E) Oud

20.	Which city is considered the cultural and creative hub of modern Kazakhstan?
A) Aktobe
B) Almaty
C) Turkestan
D) Atyrau
E) Shymkent

21.	The "Rukhani Zhangyru" program aims to:
A) Build more highways
B) Modernize national identity through culture and education
C) Expand natural gas
D) Promote agriculture
E) Open casinos

22.	Which element is often used in modern Kazakh fashion design?
A) Silk from China
B) Wool from Europe
C) Traditional ornaments and embroidery
D) Denim only
E) Leather only

23.	"The Mind of Primitive Man" was written by:
A) Franz Boas
B) Edward Tylor
C) Bronisław Malinowski
D) Raymond Williams
E) Stuart Hall

24.	Ernst Cassirer believed that humans are:
A) Political animals
B) Rational calculators
C) Symbolic animals
D) Power seekers
E) Economic beings

25.	What is a "cultural code"?
A) A genetic structure that determines culture
B) A universal legal system
C) A set of symbolic systems and meanings shared by a culture
D) A computer program
E) A scientific theory of biology

26.	A cultural code can best be described as:
A) The rules of grammar
B) The visual appearance of a culture
C) A deep structure of meanings, myths, and values that influence behavior
D) The climate of a region
E) Religious texts only

27.	In media and communication studies, cultural codes are used to:
A) Create scientific models
B) Decode and analyze meaning in texts and media
C) Set economic policies
D) Interpret weather data
E) Produce industrial goods

28.	Which of the following fields most frequently studies cultural codes?
A) Chemistry
B) Engineering
C) Culturology and Anthropology
D) Geometry
E) Architecture

29.	The idea that "food is a communication system" comes from which approach?
A) Political science
B) Semiotics
C) Astronomy
D) Behavioral economics
E) Pharmacology

30.	When someone misinterprets a cultural gesture, it may be due to:
A) Language error
B) Lack of education
C) A misunderstanding of the cultural code
D) Memory loss
E) Technology failure

31.	Which concept best describes a community's general perception of the world and human existence?
A) Legislation
B) Worldview
C) Geography
D) Fashion
E) Demographics

32.	How are ethos and worldview transmitted within a culture?
A) Through media and education
B) Through traditions and rituals
C) Through language and communication
D) Through religion and art
E) All of the above

33.	What does the term "ethos" refer to in cultural studies?
A) Economic structure
B) A set of ethical norms and moral attitudes shared by a community
C) The biological traits of a population
D) A political ideology
E) A form of entertainment

34.	Which of the following is an element of non-material culture?
A) Architecture
B) Language
C) Tools
D) Clothing
E) Food

35.	What term refers to judging another culture solely by the values and standards of one's own culture?
A) Multiculturalism
B) Cultural relativism
C) Ethnocentrism
D) Cultural diffusion
E) Enculturation

36.	What is the most commonly accepted definition of culture?
A) Biological inheritance
B) Technological advancement
C) Shared beliefs, values, and practices of a group
D) Economic system of a nation
E) Physical environment

37.	Which studio has historically played a central role in producing Kazakh films?
A) Studio Mosfilm
B) Kazakhfilm
C) Central Asia Pictures
D) Steppe Studios
E) Alatau Films

38.	What is the primary function of language in human society?
A) Decoration
B) Survival instinct
C) Communication
D) Genetic transfer
E) Imitation

39.	What is non-verbal communication?
A) Communication using language
B) Communication without words
C) Writing emails
D) Grammar correction
E) Silent reading

40.	Which of the following is NOT a component of verbal communication?
A) Vocabulary
B) Syntax
C) Tone of voice
D) Facial expressions
E) Grammar

41.	What is digitalization in the context of culture?
A) Using paper records for data storage
B) Applying mathematical models to society
C) The integration of digital technologies into cultural practices and institutions
D) The destruction of traditional customs
E) The development of agricultural tools

42.	Which of the following is an example of digital culture?
A) Traditional dances
B) Oral storytelling
C) Social media content creation
D) Folk art
E) Religious rituals

43.	What does the term "digital divide" refer to?
A) The separation of urban and rural areas
B) The gap between those who have access to digital technologies and those who do not
C) The difference between two cultures
D) A global peace treaty
E) Generational change in language

44.	Which of the following best illustrates global digital culture?
A) A local newspaper
B) Traditional pottery
C) Viral internet memes
D) Religious sermons
E) National flags

45.	What role does artificial intelligence (AI) play in digital culture?
A) It is used only in factories
B) It helps translate languages, create art, and analyze cultural data
C) It replaces humans in sports
D) It destroys internet access
E) It prevents online learning

46.	Digital humanities refers to:
A) A new religion
B) Study of ancient tools
C) The use of digital tools to study humanities disciplines
D) Replacement of books with robots
E) Natural sciences

47.	Which social media platform is known for its cultural influence globally?
A) Telegram
B) WhatsApp
C) TikTok
D) Excel
E) Firefox

48.	Which technology is commonly used in the digital preservation of cultural sites?
A) Steam engines
B) Artificial intelligence
C) 3D scanning and virtual reality
D) Typewriters
E) Morse code

49.	Which of the following is an example of digital culture?
A) Traditional dances
B) Oral storytelling
C) Social media content creation
D) Folk art
E) Religious rituals

50.	What is digitalization in the context of culture?
A) Using paper records for data storage
B) Applying mathematical models to society
C) The integration of digital technologies into cultural practices and institutions
D) The destruction of traditional customs
E) The development of agricultural tools

51.	How has digitalization changed the way cultural heritage is preserved?
A) It has reduced access to heritage
B) It allows for digital archiving and wider dissemination
C) It destroys historical records
D) It prevents cultural exchange
E) It limits international cooperation

52.	What is semiotics?
A) The study of stars
B) The study of historical facts
C) The study of signs and symbols and their use or interpretation
D) The study of grammar rules
E) The study of human anatomy

53.	Who is considered one of the founding fathers of modern semiotics?
A) Karl Marx
B) Charles Darwin
C) Ferdinand de Saussure
D) Albert Einstein
E) Max Weber

54.	Which field most commonly uses semiotic analysis today?
A) Physics
B) Chemistry
C) Media and cultural studies
D) Mathematics
E) Engineering

55.	In Peirce's semiotics, what are the three types of signs?
A) Natural, supernatural, artificial
B) Icon, index, symbol
C) Word, sound, image
D) Denotation, connotation, myth
E) Logical, poetic, emotional

56.	Which alphabet was historically used by early Turkic peoples?
A) Latin
B) Cyrillic
C) Orkhon-Yenisey script (Old Turkic script)
D) Arabic script only
E) Greek script

57.	What is a defining characteristic of traditional Turkic culture?
A) Sedentary farming lifestyle
B) Maritime navigation
C) Nomadic pastoralism
D) Urban industrialization
E) Slave-based economy

58.	What is the significance of the Orkhon inscriptions?
A) Religious commandments
B) Ancient Turkic legal codes
C) The earliest known written records in a Turkic language
D) Treaties with China
E) Medical texts

59.	What does the word "Tengri" refer to in ancient Turkic beliefs?
A) A type of garment
B) A sacred book
C) The sky deity or god of the heavens
D) A battle strategy
E) A mountain spirit

60.	What is a "yurt" in Turkic tradition?
A) A royal title
B) A traditional horse saddle
C) A portable round tent used by nomads
D) A sacred religious relic
E) A musical instrument

61.	Which musical instrument is commonly found in Turkic folk culture?
A) Violin
B) Dombra
C) Sitar
D) Oud
E) Harp

62.	What role did oral poetry and storytelling play in Turkic culture?
A) It was mainly entertainment for children
B) It was used to pass time during winter
C) It preserved history, values, and traditions
D) It replaced written language entirely
E) It was imported from neighboring cultures

63.	The epic "Manas" is associated with which Turkic group?
A) Uighurs
B) Kazakhs
C) Uzbeks
D) Kyrgyz
E) Tatars

64.	Which of the following empires was founded by a Turkic people?
A) Roman Empire
B) Ottoman Empire
C) Mongol Empire
D) Han Dynasty
E) Persian Empire

65.	Which religion had a strong influence on the Turkic peoples before the spread of Islam?
A) Christianity
B) Hinduism
C) Shamanism and Tengrism
D) Buddhism only
E) Confucianism

66.	Cultural hybridization refers to:
A) The loss of national identity
B) The merging of traditional and modern practices
C) The rejection of technological advancements
D) The revival of indigenous languages
E) The political unification of states

67.	Which ancient philosopher was born in the territory of present Kazakhstan?
A) Aristotle
B) Al-Farabi
C) Ibn Sina
D) Descartes
E) Confucius

68.	Which famous Kazakh poet and philosopher wrote "The Book of Words" ("Kara Sozder")?
A) Shakarim
B) Saken Seifullin
C) Abai Kunanbayev
D) Al-Farabi
E) Zhambyl Zhabayev

69.	What does the eagle on the Kazakh flag symbolize?
A) War
B) Power and freedom
C) Religion
D) Agriculture
E) Peace

70.	Name Kazakh leader who led a major national-liberation uprising in the 19th century:
A) Ablai Khan
B) Kenesary Kasymov
C) Abulkhair Khan
D) Kerey Khan
E) Tole Bi

71.	The process of introducing an individual to culture, assimilating existing habits, norms, and values peculiar to a given culture is:
A) Habits
B) Canon
C) Inculturation
D) Norms
E) Values

72.	The system of values and norms of behavior characteristic of individual demographic, professional and other groups that does not fundamentally contradict the dominant culture is:
A) Norms
B) Religion
C) Canon
D) Counterculture
E) Subculture

73.	Mass culture is the culture of the masses (people), the majority of members of society, a culture that, in principle, cannot generally be at the highest level with the continuity of cultural development (creativity), so it is also known as:
A) not popular
B) popular
C) subculture
D) elite
E) individual

74.	The project "Sacred Geography of Kazakhstan" was launched in:
A) 2017
B) 2018
C) 2020
D) 2022
E) 2024

75.	The project "Cultural Heritage" was developed in 2003 on the initiative of the President of Kazakhstan N. Nazarbayev. The implementation of the program began in:
A) 2004
B) 2006
C) 2007
D) 2009
E) 2010

76.	What is the name of Khodzha Akhmed Yasawi's famous work?
A) Dīwān-i Hikmat (Compendium of Wisdom)
B) Blessed knowledge
C) History
D) Religion
E) Royal wisdom

77.	Name the major researcher who traveled to Altai, Semirechye, and Central Asia:
A) Semenov-Tian-Shansky
B) Radlov
C) Velyaminov-Zernov
D) Dobrossmyslov
E) Makovetsky

78.	Who composed the music for Altynsarin's poem "Kel, balalar, okylyq" ("Come, children, let's study")?
A) Zhaya Musa
B) Birzhan sal
C) Akan-sere
D) Ykylas
E) Mayra

79.	The founder of the lyrical direction in dombra music is:
A) Kurmangazy
B) Tattimbet
C) Dauletkerey
D) Ykylas
E) Birzhan

80.	What is the basis of the Kazakh reverence for ancestors?
A) the cult of ancestors
B) belief in the protection of aruak (spirits)
C) unconditional respect for elders
D) filial duty
E) sense of duty

81.	What is a characteristic feature of Kazakh society?
A) complex intra-ethnic structure
B) belonging to a specific clan (ru)
C) significance of social status of an individual
D) complex structure of tribal organization
E) presence of a heroic ancestor

82.	Which of the following does NOT belong to women's crafts among Kazakhs?
A) embroidery
B) carpet weaving
C) braiding/weaving
D) wood carving
E) applique decoration

83.	The spread of Islam in Kazakhstan began in which century?
A) 6th century
B) 8th century
C) 10th century
D) 11th century
E) 5th century BCE

84.	The archaeologist who discovered the "Golden Man" of the Sak period:
A) Akishev, Issyk
B) Argymbayev, Almaty
C) Kopylov, Talgar
D) Mukanova, Aktobe
E) an archaeologist who concealed his name

85.	Which folk musical instrument is associated with shamanism?
A) sybyzgy
B) kobyz
C) dombra
D) sherter
E) syrnai

86.	Which ritual song is performed by a bride?
A) kórisu
B) zhoktaw
C) synsu
D) kara ólen
E) zhar-zhar

87.	Which feature characterizes the philosophy of Kazakh Enlightenment classics?
A) materialism
B) metaphysics
C) irrationalism
D) humanism
E) teleologism

88.	Which area of Chokan Valikhanov's philosophical views is the most developed?
A) philosophy of religion
B) epistemology
C) ontology
D) philosophy of history
E) axiology

89.	The central problem of Abai's philosophy is:
A) cognition
B) human being
C) religion
D) ontology
E) metaphysics

90.	How does Abai describe the state of Kazakh society of his time?
A) as a golden age
B) he gives no evaluation
C) as a given
D) as a stage toward a specific goal
E) critically, as requiring transformation

91.	From 1898–1928 Shakarim wrote one of his major philosophical works titled "Three …":
A) admonitions
B) companions
C) delusions
D) truths
E) moral laws

92.	"Adam bol!" ("Be a human!") – a principle first proclaimed by:
A) Abai
B) A. Baitursynov
C) Ch. Valikhanov
D) A. Bukeykhanov
E) Shakarim

93.	Which European thinkers did Abai know well?
A) Hegel
B) Kant
C) Descartes
D) Bacon
E) Spinoza

94.	For improving the social organism, Ch. Valikhanov said it is necessary to consider three factors: structure of the tribal organism, conditions of the environment, climate and soil, and …
A) spread of religion
B) scale of ignorance
C) motives and incentives
D) nature of authority
E) position of local rulers

95.	The main political stance of the "Alash" party was:
A) non-violence
B) connection with sharua (peasants)
C) clear political program
D) consideration of people's religiosity
E) education in the native language

96.	The philosophy of Kazakh Enlightenment is characterized by:
A) materialism
B) metaphysics
C) irrationalism
D) humanism
E) idealism

97.	The cult of ancestors among Kazakhs is called:
A) Umai
B) Allah
C) Dingir
D) Tengri
E) Aruakh

98.	To which type of civilization does Kazakh culture belong?
A) Western
B) Eastern
C) Central Asian
D) Middle Eastern
E) Eurasian

99.	Who contributed to the development and spread of Sufism on the territory of Kazakhstan?
A) Al-Farabi
B) Akhmet Yugnaki
C) Akhmet Yassawi
D) Mahmud Kashgari
E) Al-Ghazali

100.	Prominent representatives of Soviet Kazakh culture are:
A) A. Kunanbayev, Z. Zhabaev, M. Auezov
B) A. Kunanbayev, Y. Altynsarin, Ch. Valikhanov
C) Sh. Kudaiberdiev, M. Dulatov
D) Z. Zhabaev, S. Seifullin, M. Auezov
E) D. Nurpeisova, Kurmangazy, Dauletkerey

101.	The well-known scholar who deeply studied Kazakh musical art (before the October Revolution):
A) Castagne A.
B) Potanin G.
C) Zataevich A.
D) Eichhorn A.
E) Rybakov S.

102.	The famous scholar, linguist, educator, and editor of the newspaper "Kazakh":
A) Zhumabayev M.
B) Aimanov J.
C) Dulatov M.
D) Asfendiyarov S.
E) Baitursynov A.

103.	The reformer of the Kazakh alphabet was:
A) A. Baitursynov
B) A. Kunanbayev
C) A. Bokeykhanov
D) Sh. Kudaiberdiev
E) I. Altynsarin

104.	Which of the following is NOT a Kazakh epic?
A) "Koblandy"
B) "Alpamys"
C) "Kyz Zhibek"
D) "Manas"
E) "Ayman-Sholpan"

105.	Who is the author of the Kazakh national manifesto "Oyan, qazaq!" ("Wake up, Kazakh!")?
A) M. Dulatov
B) M. Mukataev
C) K. Myrzaliev
D) M. Zhumabayev
E) A. Zhumabayev

106.	Who introduced the term "mankurt" into scholarly discourse?
A) R. Park
B) T. Parsons
C) Ch. Aitmatov
D) M. Mead
E) V. Pareto

107.	Ancient nomads on the territory of Kazakhstan include:
A) Turks
B) Mongols
C) Naimans
D) Sak
E) Pashtuns

108.	The Kazakh writer, author of the epic novel "The Path of Abai":
A) M. Auezov
B) S. Mukanov
C) I. Yessenberlin
D) G. Mustafin
E) S. Seifullin

109.	A bright representative of heroic zhyrau poetry:
A) Koblandy
B) Asan Kaigy
C) Bukhar zhyrau
D) Balasaguni
E) Kaztugan

110.	Kurmangazy's first mentor in dombra playing was:
A) Uzak
B) Khanbazar
C) Alikey
D) Makar
E) Turyp

111.	Which factor played the most significant role in the formation of nomadic Kazakh culture?
A) Climate and steppe ecology
B) Urbanization
C) Influence of Roman civilization
D) Geographical isolation
E) Decline of agriculture

112.	The concept of "Tengri" in early Turkic culture refers to:
A) Ancestor
B) Supreme Sky Deity
C) Heroic warrior
D) Prophet
E) Nature spirit

113.	The "zhol" (жол) in Kazakh traditional culture most accurately means:
A) Battle
B) Path, moral code
C) Clan name
D) Ritual dance
E) Sacrifice

114.	The earliest written evidence of Turkic languages is found in:
A) Sogdian manuscripts
B) Orkhon-Yenisei inscriptions
C) Persian chronicles
D) Arabic letters
E) Chinese Tang texts

115.	The term "ethnoculture" refers to:
A) Individual creativity
B) Cultural norms of a specific ethnic group
C) World globalization
D) Urban lifestyle
E) Social mobility

116.	Which Kazakh custom is performed to express gratitude?
A) Tusau kesu
B) Shashu
C) Betashar
D) Asar
E) Syngsu

117.	What is characteristic of oral nomadic culture?
A) Dominance of written literature
B) Architectural monumentalism
C) Strong epic storytelling traditions
D) Printing of books
E) Latin script development

118.	Who is considered the founder of the Kazakh Khanate?
A) Abylay Khan
B) Kasym Khan
C) Kerei and Zhanibek
D) Tauke Khan
E) Esim Khan

119.	"Zheti ata" tradition establishes rules of:
A) Military hierarchy
B) Kinship and marriage restrictions
C) Trade relations
D) Religious practices
E) Hospitality

120.	Which city was a major cultural center of the Great Silk Road on Kazakh territory?
A) Uralsk
B) Taldykorgan
C) Otyrar
D) Kokshetau
E) Pavlodar

121.	The primary genre of Kazakh oral literature is:
A) Chronicle
B) Epic (epos)
C) Poetic drama
D) Novel
E) Haiku

122.	The term "bi" in traditional Kazakh society refers to:
A) Warrior
B) Judge and wise mediator
C) Musician
D) Shaman
E) Artisan

123.	Which of the following is a Kazakh heroic epic?
A) "Shahnameh"
B) "Alpamys"
C) "Layli-Majnun"
D) "Mahabharata"
E) "Odyssey"

124.	The Kazakh yurt is an example of:
A) Stationary architecture
B) Artistic abstraction
C) Mobile dwelling adapted to nomadism
D) Religious structure
E) Military shelter

125.	Which instrument traditionally accompanied shamans?
A) Dombra
B) Kobyz
C) Zhetigen
D) Sybyzgy
E) Sherter

126.	The philosophy of Abai emphasizes primarily:
A) Mysticism
B) Material acquisition
C) Humanism and moral perfection
D) Polytheism
E) Military heroism

127.	In Kazakh culture "Asar" means:
A) Bride's farewell
B) Communal mutual help
C) Funeral ritual
D) Horse race
E) Wedding feast

128.	"Zhangyrtu" (modernization) in modern Kazakhstan refers to:
A) Isolation from global culture
B) Return to medieval traditions
C) Integration of heritage with modern progress
D) Rejection of national identity
E) Decline of education

129.	Which thinker is known as the "Second Teacher" after Aristotle?
A) Ibn Sina
B) Al-Farabi
C) Attar
D) Al-Kindi
E) Gazali

130.	Sufism contributed to:
A) Industrialization
B) Development of spiritual ethics
C) Growth of military elite
D) Urban destruction
E) Decline of literature

131.	Which concept expresses gratitude in Kazakh values?
A) Rakhmet
B) Zhasau
C) Aruak
D) Kydyr
E) Zheke

132.	Kazakh ornaments "koshkar muyiz" symbolize:
A) Female beauty
B) Military courage
C) Ram's horns — strength and prosperity
D) Celestial sky
E) Death and rebirth

133.	"Book of Words" ("Kara Sozder") was written by:
A) Shakarim
B) Abai
C) Magzhan
D) Bukhar zhyrau
E) Dulatov

134.	The main marriage prohibition in Kazakh culture is:
A) Marriage with foreigners
B) Marriage between social classes
C) Marriage within seven ancestors (zheti ata)
D) Marriage under 18
E) Marriage without dowry

135.	The traditional Kazakh worldview is best described as:
A) Rational-materialistic
B) Nomadic-holistic and nature-centered
C) Urban-industrial
D) Mediterranean
E) Secular-technocratic

136.	The "Golden Man" symbolizes:
A) Early Christianity
B) Decline of nomadism
C) High craftsmanship of Saks civilization
D) Mongol occupation
E) Medieval Islamization

137.	Which Kazakh poet is associated with the national awakening movement?
A) M. Auezov
B) S. Seifullin
C) M. Zhumabayev
D) A. Kunanbayev
E) S. Mukanov

138.	"Kyz uzatu" is a ceremony related to:
A) Funeral
B) Childbirth
C) Bride's departure from her family
D) Horse sacrifice
E) Victory celebration

139.	The main functions of music in nomadic culture include:
A) Only entertainment
B) Military signals, rituals, storytelling
C) Banking, trade, taxation
D) Animal domestication
E) Farming development

140.	Culture is generally defined as:
A) a biological characteristic
B) a system of learned behaviors
C) a natural instinct
D) a genetic code
E) a spontaneous habit

141.	The term "cultural relativism" refers to:
A) judging all cultures by Western standards
B) viewing cultures based on global norms
C) understanding a culture within its own context
D) rejecting all cultural differences
E) promoting one universal culture

142.	Which of the following is an example of intangible cultural heritage?
A) monuments
B) traditional songs
C) archaeological sites
D) manuscripts
E) architectural complexes

143.	The Great Silk Road primarily contributed to:
A) religious isolation
B) the decline of trade
C) cultural exchange
D) political stagnation
E) agricultural collapse

144.	A dominant culture is:
A) a minority culture
B) the culture of immigrants
C) the culture holding power in a society
D) an ancient extinct culture
E) a purely religious culture

145.	The "Kazakh Yurt" is primarily associated with:
A) settled agricultural life
B) nomadic lifestyle
C) urban architecture
D) religious rituals
E) industrial production

146.	Tengrianism is best described as:
A) a branch of Buddhism
B) a form of monotheism centered around the sky deity
C) a Christian doctrine
D) a type of shamanic dance
E) a philosophical school of antiquity

147.	The main social unit in traditional Kazakh society was:
A) the nuclear family
B) the tribe (ru)
C) the urban commune
D) the monastery
E) the merchant guild

148.	Which feature is typical of nomadic culture?
A) large stationary cities
B) intensive agriculture
C) high mobility
D) caste system
E) monumental stone architecture

149.	Intercultural communication studies:
A) genetic adaptation
B) exchange of cultural values and meanings
C) geological processes
D) economic taxation
E) legal frameworks

150.	Who defined culture as "a complex whole that includes knowledge, belief, art, morals, law, and custom"?
A) Max Weber
B) Edward Tylor
C) Emile Durkheim
D) Clifford Geertz
E) Franz Boas

151.	High culture usually refers to:
A) popular media
B) mass entertainment
C) elite artistic achievements
D) informal folklore
E) children's culture

152.	The global spread of fast-food chains is an example of:
A) cultural isolation
B) de-globalization
C) cultural homogenization
D) reverse diffusion
E) cultural taboo

153.	The main feature of industrial civilization is:
A) tribal governance
B) machine-based production
C) nomadic herding
D) sacred kingship
E) oral communication only

154.	Which term refers to symbols, values, norms, and language?
A) material culture
B) economic culture
C) symbolic culture
D) biological culture
E) ecological culture

155.	Which of the following is a world intangible heritage site related to Kazakhstan?
A) Machu Picchu
B) The Great Wall
C) Traditional dombra music
D) Stonehenge
E) Petra

156.	The term "myth" in cultural studies means:
A) only a false story
B) a narrative that explains the world through symbols
C) a scientific law
D) a political manifesto
E) an economic strategy

157.	National identity consists of:
A) only economic interests
B) only political institutions
C) shared history, language, and cultural symbols
D) random events
E) individual emotions

158.	Cultural globalization includes:
A) isolation of societies
B) increased interconnectedness of cultures
C) prohibition of travel
D) destruction of diversity
E) elimination of national symbols

159.	A worldview system that explains existence and includes creation myths is called:
A) astronomy
B) mythology
C) algebraic model
D) linguistic code
E) ecological plan

160.	The UNESCO Convention of 2003 focuses on:
A) protection of endangered animals
B) safeguarding intangible cultural heritage
C) global trade regulations
D) environmental policy
E) international security
`

// Answer key for Culturology (0-indexed: A=0, B=1, C=2, D=3, E=4)
const CULTUROLOGY_ANSWER_KEY: Record<number, number> = {
  1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 4, 7: 2, 8: 2, 9: 1, 10: 1,
  11: 2, 12: 0, 13: 3, 14: 0, 15: 2, 16: 2, 17: 2, 18: 1, 19: 2, 20: 1,
  21: 1, 22: 2, 23: 0, 24: 2, 25: 2, 26: 2, 27: 1, 28: 2, 29: 1, 30: 2,
  31: 1, 32: 4, 33: 1, 34: 1, 35: 2, 36: 2, 37: 1, 38: 2, 39: 1, 40: 3,
  41: 2, 42: 2, 43: 1, 44: 2, 45: 1, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2,
  51: 1, 52: 2, 53: 2, 54: 2, 55: 1, 56: 2, 57: 2, 58: 2, 59: 2, 60: 2,
  61: 1, 62: 2, 63: 3, 64: 1, 65: 2, 66: 1, 67: 1, 68: 2, 69: 1, 70: 1,
  71: 2, 72: 4, 73: 1, 74: 0, 75: 0, 76: 0, 77: 1, 78: 0, 79: 1, 80: 1,
  81: 1, 82: 3, 83: 1, 84: 0, 85: 1, 86: 2, 87: 3, 88: 3, 89: 1, 90: 4,
  91: 3, 92: 0, 93: 4, 94: 2, 95: 4, 96: 3, 97: 4, 98: 4, 99: 2, 100: 3,
  101: 2, 102: 4, 103: 0, 104: 3, 105: 0, 106: 2, 107: 3, 108: 0, 109: 2, 110: 0,
  111: 0, 112: 1, 113: 1, 114: 1, 115: 1, 116: 1, 117: 2, 118: 2, 119: 1, 120: 2,
  121: 1, 122: 1, 123: 1, 124: 2, 125: 1, 126: 2, 127: 1, 128: 2, 129: 1, 130: 1,
  131: 0, 132: 2, 133: 1, 134: 2, 135: 1, 136: 2, 137: 2, 138: 2, 139: 1, 140: 1,
  141: 2, 142: 1, 143: 2, 144: 2, 145: 1, 146: 1, 147: 1, 148: 2, 149: 1, 150: 1,
  151: 2, 152: 2, 153: 1, 154: 2, 155: 2, 156: 1, 157: 2, 158: 1, 159: 1, 160: 1
}


// ==========================================
// EXPORTS
// ==========================================

export const QUESTIONS_PHILOSOPHY = parseQuestions(PHILOSOPHY_RAW_DATA, PHILOSOPHY_ANSWER_KEY)
export const QUESTIONS_PSYCHOLOGY = parseQuestions(PSYCHOLOGY_RAW_DATA, PSYCHOLOGY_ANSWER_KEY)
export const QUESTIONS_CULTUROLOGY = parseQuestions(CULTUROLOGY_RAW_DATA, CULTUROLOGY_ANSWER_KEY)

// Combined Psychology + Cultural Studies questions
// IDs are offset for culturology to avoid conflicts
const culturologyQuestionsWithOffset = parseQuestions(CULTUROLOGY_RAW_DATA, CULTUROLOGY_ANSWER_KEY).map((q, index) => ({
  ...q,
  id: 91 + index + 1 // Offset culturology IDs to avoid conflicts with psychology
}))
export const QUESTIONS_PSYCHOCULTURAL = [
  ...parseQuestions(PSYCHOLOGY_RAW_DATA, PSYCHOLOGY_ANSWER_KEY),
  ...culturologyQuestionsWithOffset
]

// Part configuration for practice mode
export const PART_CONFIG = {
  philosophy: { partCount: 4, questionsPerPart: [50, 50, 50, 50] },
  psychology: { partCount: 3, questionsPerPart: [30, 30, 31] },
  culturology: { partCount: 4, questionsPerPart: [40, 40, 40, 40] },
  psychocultural: { partCount: 5, questionsPerPart: [50, 50, 50, 50, 51] }
} as const
